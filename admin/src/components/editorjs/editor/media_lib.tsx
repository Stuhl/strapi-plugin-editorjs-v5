import { useStrapiApp } from "@strapi/strapi/admin"

interface MediaLibraryProps {
  open    : boolean
  onChange: Function
  onToggle: Function
}

export const MediaLibrary = (props: MediaLibraryProps) => {
  const {
    onChange = () => {},
    onToggle = () => {},
    open
  } = props

  const {components}       = useStrapiApp("library", (app) => app)
  const MediaLibraryDialog = components["media-library"]

  const handleAssets = (files: any) => {
    const formattedFiles = files.map((file: any) => {
      return {
        alt    : file.alternativeText || file.name,
        url    : file.url,
        mime   : file.mime,
        width  : file.width,
        height : file.height,
        size   : file.size,
        formats: file.formats
      }
    })

    onChange(formattedFiles)
  }

  if (!open) {
    return null
  }

  return (
    <MediaLibraryDialog
      allowedTypes      ={["images"]}
      onClose           ={onToggle}
      onSelectAssets    ={handleAssets}
    />
  )
}

export class MediaLibraryAdapter {
  api   : any
  config: any
  data  : any
  nodes : any
  state : "NO_IMAGE" | "HAS_IMAGE"

  constructor(options: any) {
    this.api    = options.api
    this.config = options.config || {}
    this.data   = options.data
    this.state  = "NO_IMAGE"

    this.nodes = {
      placeholder: null,
      image      : null
    }
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 336 276"><path d="M291 150.242V79c0-18.778-15.222-34-34-34H79c-18.778 0-34 15.222-34 34v42.264l67.179-44.192 80.398 71.614 56.686-29.14L291 150.242zm-.345 51.622l-42.3-30.246-56.3 29.884-80.773-66.925L45 174.187V197c0 18.778 15.222 34 34 34h178c17.126 0 31.295-12.663 33.655-29.136zM79 0h178c43.63 0 79 35.37 79 79v118c0 43.63-35.37 79-79 79H79c-43.63 0-79-35.37-79-79V79C0 35.37 35.37 0 79 0z"/></svg>'
    }
  }

  render() {
    const currentIndex = this.api.blocks.getCurrentBlockIndex()

    const wrapper = document.createElement("DIV")

    this.nodes.placeholder = document.createElement("DIV")
    const text             = document.createElement("P")

    this.nodes.placeholder.style.backgroundColor = "hsla(0, 0%, 80%, 1)"
    this.nodes.placeholder.style.height = "200px"
    this.nodes.placeholder.style.width = "100%"
    this.nodes.placeholder.style.display = "grid"
    this.nodes.placeholder.style.justifyItems = "center"
    this.nodes.placeholder.style.alignItems = "center"
    text.innerHTML = "Add Image"
    text.style.fontSize = "48px"
    this.nodes.placeholder.appendChild(text)
    this.nodes.placeholder.addEventListener("click", () => {
      if (this.config.mediaLibToggle) {
        this.config.mediaLibToggle(currentIndex)
      }
    })

    this.nodes.image = document.createElement("IMG")

    wrapper.appendChild(this.nodes.placeholder)

    if (this.data.file?.url) {
      this.nodes.image.src = this.data.file.url
    }

    this.nodes.image.onload = () => {
      wrapper.appendChild(this.nodes.image)
      this.nodes.placeholder.style.display = "none"
      wrapper.removeChild(this.nodes.placeholder)
      this.state = "HAS_IMAGE"
    }

    return wrapper
  }

  save(blockContent: any) {
    const {
      caption,
      file,
      stretched,
      withBackground,
      withOrder
    } = this.data

    if (this.state === "NO_IMAGE") {
      return null
    }

    return {
      caption,
      file,
      stretched,
      withBackground,
      withOrder
    }
  }

  validate(savedData: any) {
    if (this.state === "NO_IMAGE") {
      return false
    }

    return true
  }
}