import React, { SetStateAction, useCallback, useRef, useState } from "react"
import { EDITOR_JS_TOOLS, CUSTOM_IMAGE_TOOL } from "./editor_tools"
import { createReactEditorJS } from "react-editor-js"
import { MediaLibrary, MediaLibraryAdapter } from "./media_lib"
import SkillInlineTool from "./skill_inlne_tool"

const ReactEditorJS = createReactEditorJS()

interface EditorProps {
  onChange: Function
  name    : string
  value   : any
  disabled: boolean
}

const Editor = (props: EditorProps) => {
  const {
    onChange,
    name,
    value
  } = props

  const [mediaLibOpen, setMediaLibOpen] = useState<boolean>(false)
  const [mediaIndex, setMediaIndex]     = useState<number>(-1)

  const editorAPI = useRef(null)

  const handleMediaLibChange = (data: any) => {
    insertImages({
      data,
      editorAPI: editorAPI.current,
      index    : mediaIndex,
      setIndex : setMediaIndex
    })
    handleMediaLibToggle()
  }

  const handleMediaLibToggle = (index?: number) => {
    if (index) {
      setMediaIndex(index)
    }

    setMediaLibOpen(prev => !prev)
  }

  // useEffect(() => {
  //   if (editor) {
  //     editor._editorJS.render(blocks)
  //   }
  // }, [blocks])

  const IMAGE_ADAPTER_TOOL = {
    image: {
      class : MediaLibraryAdapter,
      config: {
        mediaLibToggle: handleMediaLibToggle
      }
    }
  }

  const tools = {
    ...EDITOR_JS_TOOLS,
    // ...CUSTOM_IMAGE_TOOL,
    ...IMAGE_ADAPTER_TOOL,
    ...{
      skillSelection: {
        class: SkillInlineTool
      }
    }
  }



  const parsedValue = value && value.length > 0 ? JSON.parse(value) : {}


  return (
    <div style={{
      border      : "1px solid rgb(227, 233, 243)",
      borderRadius: "2px",
      marginTop   : "4px"
    }}>
      <ReactEditorJS
        // instanceRef={handleInitialize}
        defaultValue={parsedValue}
        // onReady     ={(api: any) => {
        //   console.log(JSON.parse(value).blocks.length)
        //   if (value && JSON.parse(value).blocks.length) {
        //     api.blocks.render(JSON.parse(value))
        //   }
        // }}
        onChange    ={(api: any) => {
          editorAPI.current = api

          api.saver.save().then((data: any) => {
            onChange({
              target: {
                name: name,
                value: JSON.stringify(data)
              }
            })
          })
        }}
        tools={tools}
      />
      <MediaLibrary
        open    ={mediaLibOpen} 
        onChange={handleMediaLibChange} 
        onToggle={handleMediaLibToggle}
      />
    </div>
  )
}

type insertImageProps = {
  editorAPI: any
  index    : number
  setIndex : React.Dispatch<SetStateAction<number>>
  data     : any
}

const insertImages = (props: insertImageProps) => {
  let insertedBlocksCounter = 0

  for (let image of props.data) {
    const isImage = image.mime.includes("image")

    if (!isImage) {
      return 
    }

    // const blockData = {
    //   id  : Math.random().toString(16).slice(2),
    //   type: "image",
    //   data: {
    //     file: {
    //       url    : `${window.location.origin}${image.url}`,
    //       mime   : image.mime,
    //       height : image.height,
    //       width  : image.width,
    //       size   : image.size,
    //       alt    : image.alt,
    //       formats: image.formats
    //     },
    //     caption       : "",
    //     withOrder     : false,
    //     withBackground: false,
    //     stretched     : false
    //   }
    // }

    const blockData = {
      file: {
        url: `${window.location.origin}${image.url}`,
        mime: image.mime,
        height: image.height,
        width: image.width,
        size: image.size,
        alt: image.alt,
        formats: image.formats
      },
      caption: "",
      withOrder: false,
      withBackground: false,
      stretched: false
    }

    if (props.editorAPI) {
      props.editorAPI.blocks.insert("image", blockData, {}, props.index + insertedBlocksCounter, true)
    }

    // const newBlocks = {...props.blocks}
    // newBlocks.blocks = props.blocks.blocks.concat(blockData)

    // props.setBlocks(newBlocks)
    insertedBlocksCounter++
  }

  props.setIndex(-1)
}

export default Editor