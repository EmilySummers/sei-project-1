function init() {

  //  DOM variables
  const playerGrid = document.querySelector('.player-grid')
  const spaces = []
  const colors = document.querySelectorAll('img')
  let selectedColor = null
  const spacesInPlay = []
  
  
  // game variables
  const width = 4
  const height = 10
  
  // functions

  function selectColor(e) {
    selectedColor = e.target.getAttribute('alt')
    console.log(selectedColor)
    spacesInPlay.forEach(spaceInPlay => spaceInPlay.addEventListener('click', insertColor))
  }

  function insertColor(e) {
    e.target.classList.add(`${selectedColor}`)
    e.target.style.backgroundSize = '40px'
  }
   
  // loop as many times as width multiplied by height to fill the grid with spaces
  Array(width * height).join('.').split('.').forEach(() => {
    const space = document.createElement('div')
    space.classList.add('player-space')
    spaces.push(space)
    playerGrid.appendChild(space)
  })

  const resultGrid = document.querySelector('.result-grid')
  const markers = []

  Array(1 * height).join('.').split('.').forEach(() => {
    const marker = document.createElement('div')
    marker.classList.add('result-space')
    markers.push(marker)
    resultGrid.appendChild(marker)
  })

  const code = document.querySelector('.code')
  const codeBlock = []

  Array(width * 1).join('.').split('.').forEach(() => {
    const codeMarker = document.createElement('div')
    codeMarker.classList.add('player-space')
    codeBlock.push(codeMarker)
    code.appendChild(codeMarker)
  })


  function playGame() {
    let i = 39
    let n = i - 3
    for (i; i >= n; i--) {
      spacesInPlay.push(spaces[i])
    }
  }

  playGame()

  //! do not convert to set (just use array from the start) if duplicates are allowed

  const availableColors = ['green', 'purple', 'orange', 'teal', 'yellow', 'pink', 'grey', 'red']
  const chosenColors = new Set

  function generateCode() {

    while (chosenColors.size < 4) {
      chosenColors.add(availableColors[Math.floor(Math.random() * 8)])
    }
    //!   for (let i = 0; i < 4; i++) {
    //!   chosenColors.push(availableColors[Math.floor(Math.random() * 8)])
    //!   }

    const colorsArray = [...chosenColors]
    const p = 0
    const newArray = codeBlock.map((item, p) => {
      item.classList.add(colorsArray[p])
      p++
    })
    return newArray 
  }

  generateCode()

  
  // event handlers

  colors.forEach(color => color.addEventListener('click', selectColor))

}

window.addEventListener('DOMContentLoaded', init)