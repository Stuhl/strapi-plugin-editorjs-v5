import type { Core } from '@strapi/strapi'
import ogs from "open-graph-scraper"
import axios from "axios"
import fs from "fs"
import path from "path"
import {LocalFileData} from "get-file-object-from-local-path"

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async link(ctx) {
    const results  = await ogs(ctx.query)

    if (results.error) {
      ctx.send({
        success: 0,
        meta   : {
          title      : null,
          description: null,
          image      : null
        }
      })
    }

    if (!results.error) {
      const imageURL = results.result.ogImage && results.result.ogImage.length > 0 ? { url: results.result.ogImage[0].url } : undefined

      ctx.send({
        success: 1,
        meta: {
          title      : results.result.ogTitle,
          description: results.result.ogDescription,
          image      : imageURL
        }
      }, 500)
    }
  },

  async byFile(ctx) {
    try {
      const {files} = ctx.request

      const [uploadedFile] = await strapi.plugin("upload").service("upload").upload({
        data : {},
        files: Object.values(files)
      })

      ctx.send({
        success: 1,
        file   : uploadedFile
      })
    } catch (e) {
      ctx.send({
        success: 0,
        message: e.message
      }, 500)
    }
  },

  async byURL(ctx) {
    try {
      const url         = ctx.request.body.url
      const {name, ext} = path.parse(url)
      const filePath    = `./public/${name}${ext}`

      const response = await axios.get(url, {responseType: "arraybuffer"})
      const buffer   = Buffer.from(response.data, "binary")

      await fs.promises.writeFile(filePath, buffer)

      const fileData = new LocalFileData(filePath)

      const file = {
        path: filePath,
        name: fileData.name,
        type: fileData.type,
        size: Buffer.byteLength(buffer)
      }

      const [uploadedFile] = await strapi.plugin("upload").service("upload").upload({
        data : {},
        files: file
      })

      ctx.send({
        success: 1,
        file   : uploadedFile
      })
    } catch (e) {
      ctx.send({
        success: 0,
        message: e.message
      }, 500)
    }
  }

})

export default controller
