// import Embed from "@editorjs/embed"
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
// import LinkTool from '@editorjs/link'
// import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
// import Marker from '@editorjs/marker'
// import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'

import { useAuth } from "@strapi/strapi/admin"
import Image from "@editorjs/image"
import { PLUGIN_ID } from "../../../pluginId"
import axios from 'axios'

export const EDITOR_JS_TOOLS = {
  // embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  // linkTool: LinkTool,
  // raw: Raw,
  header: Header,
  quote: Quote,
  // marker: Marker,
  // checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode, 
}

const getCustomImageTool = () => {
  const token = sessionStorage.getItem("jwtToken")

  return {
    image: {
      class: Image,
      config: {
        field: "files.image",
        additionalRequestData: {
          data: JSON.stringify({})
        },
        additionalRequestHeaders: {
          "Authorization": `Bearer ${token}`
        },
        endpoints: {
          byUrl: `/api/${PLUGIN_ID}/image/byURL`
        },
        uploader: {
          async uploadByFile(file: any) {
            const formData = new FormData()
            formData.append("data", JSON.stringify({}))
            formData.append("files.image", file)

            const { data } = await axios.post(`/api/${PLUGIN_ID}/image/byFile`, formData, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })

            return data
          }
        }
      }
    }
  }
}

export const CUSTOM_IMAGE_TOOL = getCustomImageTool()
