class SkillInlineTool {
  button   : HTMLButtonElement | null
  inputList: any
  _state   : boolean
  api      : any
  skillID  : number
  skillNode: any

  static get isInline() {
    return true
  }

  static title: string = "POE2 Skill"

  get state() {
    return this._state
  }

  set state(state: boolean) {
    this._state = state
  }

  static get sanitize() {
    return {
      span: true
    }
  }

  constructor({api}: any) {
    this.button    = null
    this._state    = false
    this.api       = api
    this.inputList = {
      input: null,
      list : null
    }
    this.skillID = null
    this.skillNode = document.createElement("SPAN")
  }

  render() {
    this.button             = document.createElement("BUTTON") as HTMLButtonElement
    this.button.type        = "button"
    this.button.innerHTML   = "S"
    this.button.classList.add(this.api.styles.inlineToolButton)

    return this.button
  }

  surround(range: Range) {
    if (!range) {
      return
    }

    if (this.state) {
      this.unwrap(range)
      return
    }

    this.wrap(range)
  }

  wrap(range: Range) {
    const selectedText = range.extractContents()

    // this.skillNode.setAttribute("data-skill-id", "-1")
    this.skillNode.style.backgroundColor = "hsla(145, 100.00%, 50.00%, 0.30)"

    this.skillNode.appendChild(selectedText)
    range.insertNode(this.skillNode)

    this.api.selection.expandToTag(this.skillNode)
  }

  unwrap(range: Range) {
    const skillNode = this.api.selection.findParentTag("SPAN")
    const text      = range.extractContents()

    skillNode.remove()
    range.insertNode(text)
  }

  checkState(selection: Selection) {
    const tag = this.api.selection.findParentTag("SPAN")

    this.state = !!tag

    if (this.state) {
      this.showActions(tag)
    } else {
      this.hideActions()
    }

    return this.state
  }

  renderActions() {
    this.inputList.input = document.createElement("input")
    this.inputList.input.type = "text"
    this.inputList.input.placeholder = "Skill suchen ..."
    this.inputList.input.hidden = true
    this.inputList.list = document.createElement("OL")

    const container = document.createElement("div")

    container.appendChild(this.inputList.input)
    container.appendChild(this.inputList.list)

    return container
  }

  showActions(tag: any) {
    this.inputList.input.hidden = false

    this.inputList.input.oninput = async (event: Event) => {
      const target = event.target as HTMLInputElement
      const value  = target.value

      const response = await fetch(strapi.backendURL + `/api/poe-two-skills?fields[0]=name&fields[1]=documentId&filters[name][$containsi]=${value}`)
      const skills   = await response.json()

      this.inputList.list.replaceChildren()

      for (let skill of skills.data) {
        const entry = document.createElement("li")
        entry.innerHTML = skill.name
        entry.style.cursor = "pointer"
        entry.onclick = () => {
          this.inputList.input.hidden = true
          this.inputList.list.replaceChildren()

          tag.innerHTML = skill.name
          tag.setAttribute("data-skill-id", String(skill.id))
        }
        this.inputList.list.appendChild(entry)
      }
    }
  }

  hideActions() {
    this.inputList.input.hidden = true
  }
}

export default SkillInlineTool