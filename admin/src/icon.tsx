const EditorIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 86 86">
      <circle cx="43" cy="43" r="43" fill="url(#a)" />
      <path fill="#fff" d="M39 21a4 4 0 0 1 8 0v44a4 4 0 0 1-8 0V21Z" />
      <path fill="#fff" d="M17 43a4 4 0 0 1 4-4h44a4 4 0 0 1 0 8H21a4 4 0 0 1-4-4Z" />
      <defs>
        <radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="matrix(43.00005 65 -65 43.00005 33 0)" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1EE4FF" />
          <stop offset="1" stop-color="#1CADFF" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default EditorIcon