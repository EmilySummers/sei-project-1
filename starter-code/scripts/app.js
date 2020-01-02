function init() {

  //  DOM variables
  const playerGrid = document.querySelector('.player-grid')
  const spaces = []
  const colors = document.querySelectorAll('img')
  let selectedColor = null
  let spacesInPlay = []
  let resultSpacesInPlay = []
  const submitBtn = document.querySelector('#submit')
  const newGameBtn = document.querySelector('#start-game')

  //! make spaces (not in play) faded and spacesInPlay current color
  
  
  // game variables
  const width = 4
  const height = 10
  let answers = []
 
  
  // functions

  // gets which color was clicked on and listens out of another click on spaces in play
  function selectColor(e) {
    selectedColor = e.target.getAttribute('alt')
    spacesInPlay.forEach(spaceInPlay => spaceInPlay.addEventListener('click', insertColor))
  }

  // changes color of space in play
  function insertColor(e) {
    if (spacesInPlay.includes(e.target)) { //! make this better?
      e.target.className = (`${selectedColor}`) // gives element only one class of color
    }
  }

  //! only let it add color to player space if they have not already done so elsewhere in pattern
   
  // generates player space grid
  Array(width * height).join('.').split('.').forEach(() => {
    const space = document.createElement('div')
    space.classList.add('empty-space')
    spaces.push(space)
    playerGrid.appendChild(space)
  })

  // generates result grid
  const resultGrid = document.querySelector('.result-grid')
  const markers = []

  Array(4 * height).join('.').split('.').forEach(() => {
    const marker = document.createElement('div')
    marker.classList.add('empty-result-space')
    markers.push(marker)
    resultGrid.appendChild(marker)
  })

  // generates code sequence grid
  const code = document.querySelector('.code')
  const codeBlock = []

  Array(width * 1).join('.').split('.').forEach(() => {
    const codeMarker = document.createElement('div')
    codeMarker.classList.add('empty-space')
    codeBlock.push(codeMarker)
    code.appendChild(codeMarker)
  })
 
  // activates current spaces in play
  let selectedColors = []

  function playGame() {
    playRound()
  }

  let i = 0
  function playRound() {
    if (i > 39) return // stops playRound running if last round
    let n = i + 3
    for (i; i <= n; i++) {
      spacesInPlay.push(spaces[i]) 
      resultSpacesInPlay.push(markers[i])

    }    
  }

  // do not convert to set (just use array from the start) if duplicates are allowed

  // generates random code sequence
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
    let p = 0
    const newArray = codeBlock.map((item, p) => {
      item.classList.remove('empty-space')
      item.classList.add(colorsArray[p])
      p++
    })
    return newArray
  }
  
  // checks for each of the code colors - if they completely match it returns red, if they don't completely match it checks if the color is in guess code at all, returns white if yes.
  function checkResult() {
    for (let i = 0; i < 4; i++) { //! change 4 to represent length of codes
      const actual = codeBlock[i].getAttribute('class')
      const guess = spacesInPlay[i].getAttribute('class')

      spacesInPlay.forEach(spaceInPlay => selectedColors.push(spaceInPlay.getAttribute('class')))

      if (actual === guess) {
        console.log('Correct!')
        answers.push('red-peg')
      } else if (selectedColors.includes(actual)) {
        console.log('Half right!')
        answers.push('white-peg')
      }
    }
    console.log(answers)
    markResult()
    resetGame()
    //! or use findIndex (see notes)
    
  }

  // resets arrays after round, activates next row up and restarts round
  function resetGame() {
    spacesInPlay = []
    resultSpacesInPlay = []
    selectedColors = []
    answers = []
    playRound()    
  }

  function markResult() {
    answers.sort()
    for (let i = 0; i < answers.length; i++) {
      resultSpacesInPlay[i].className = answers[i]
    }
  }

  // event handlers

  colors.forEach(color => color.addEventListener('click', selectColor))
  submitBtn.addEventListener('click', checkResult)
  newGameBtn.addEventListener('click', playGame)
  newGameBtn.addEventListener('click', generateCode)


}

window.addEventListener('DOMContentLoaded', init)