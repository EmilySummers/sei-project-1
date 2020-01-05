function init() {

  //  DOM variables
  const playerGrid = document.querySelector('.player-grid')
  const spaces = []
  const scoreGrid = document.querySelector('.score-grid')
  const scoreSpaces = []
  const code = document.querySelector('.code')
  const codeSequence = []
  const colors = document.querySelectorAll('.color')
  let selectedColor = null
  let spacesInPlay = []
  let scoreSpacesInPlay = []
  const submitBtn = document.querySelector('#submit')
  const newGameBtn = document.querySelector('#start-game')
  const resetGameBtn = document.querySelector('#reset-game')

  //! make spaces (not in play) faded and spacesInPlay current color
  
  
  // game variables
  const width = 4
  const height = 10
  let score = []
  const availableColors = ['green', 'purple', 'orange', 'teal', 'yellow', 'pink', 'grey', 'red']
  const chosenColors = new Set
  let selectedColors = []
  let i = 0

  // creates player, result and code grids

  // player grid
  Array(width * height).join('.').split('.').forEach(() => {
    const space = document.createElement('div')
    space.classList.add('empty-space')
    spaces.push(space)
    playerGrid.appendChild(space)
  })

  // result grid
  Array(4 * height).join('.').split('.').forEach(() => {
    const scoreSpace = document.createElement('div')
    scoreSpace.classList.add('empty-score')
    scoreSpaces.push(scoreSpace)
    scoreGrid.appendChild(scoreSpace)
  })

  // code grid
  Array(width * 1).join('.').split('.').forEach(() => {
    const codeSpace = document.createElement('div')
    codeSpace.classList.add('hidden-space')
    codeSequence.push(codeSpace)
    code.appendChild(codeSpace)
  })
 
  // functions

  // gets which color was clicked on and listens out of another click on spaces in play
  function selectColor(e) {
    selectedColor = e.target.getAttribute('alt')
    spacesInPlay.forEach(spaceInPlay => spaceInPlay.addEventListener('click', insertColor))
  }

  // changes color of space in play
  function insertColor(e) {
    if (spacesInPlay.includes(e.target)) {//! explain this
    //! && spacesInPlay.includes(selectedColor)) //! make this work
      e.target.className = (`${selectedColor}`) // gives element only one class of color
    }
  }
  //! only let it add color to player space if they have not already done so elsewhere in pattern
  
  function playGame() {
    activateRow()
    generateCode()
    newGameBtn.style.display = 'none'
  }

  function activateRow() {
    if (i > 39) return // stops squresInPlay running if last round
    const n = i + 3
    for (i; i <= n; i++) {
      spacesInPlay.push(spaces[i]) 
      scoreSpacesInPlay.push(scoreSpaces[i])
    }  
  }
  
  function generateCode() {
    while (chosenColors.size < 4) { //! change 4 to represent length of code
      // do not convert to set (just use array from the start) if duplicates are allowed
      chosenColors.add(availableColors[Math.floor(Math.random() * 8)])
    }
    //!   for (let i = 0; i < 4; i++) {
    //!   chosenColors.push(availableColors[Math.floor(Math.random() * 8)])
    //!   }
    const colorsArray = [...chosenColors]
    return codeSequence.map((item, p) => item.setAttribute('value', colorsArray[p]))
    //! item.className = colorsArray[p]
  }
    
  // checks for each of the code colors - if they completely match it returns red, if they don't completely match it checks if the color is in guess code at all, returns white if yes.
  function reviewCode() {
    spacesInPlay.forEach(spaceInPlay => selectedColors.push(spaceInPlay.getAttribute('class')))

    for (let i = 0; i < 4; i++) { //! change 4 to represent length of code
      const codeColor = codeSequence[i].getAttribute('value')
      const guessedColor = spacesInPlay[i].getAttribute('class')
      if (codeColor === guessedColor) {
        score.push('red-peg')
      } else if (selectedColors.includes(codeColor)) {
        score.push('white-peg')
      }
    }
    displayScore() //! move these functions
    endGame()
    resetRound()
  }

  // resets arrays after round, activates next row up and restarts round
  function resetRound() {
    spacesInPlay = []
    scoreSpacesInPlay = []
    selectedColors = []
    score = []
    activateRow()    
  }

  function displayScore() {
    score.sort()
    // for (let i = 0; i < score.length; i++) {
    //   scoreSpacesInPlay[i].className = score[i]
    // }
    const newArray = scoreSpacesInPlay.map((scoreSpace, i) => { // which method??
      while (i < score.length) {
        return scoreSpace.className = score[i]
      }
    })
    return newArray
  }

  function endGame() {
    if (score[3] === 'red-peg') {
      revealCode()
      setTimeout(function() {
        alert('You have won the game!!')
        if (confirm('Would you like to play again?')) {
          resetGame()
        }
      }, 500)
    } else if (i > 39 && score[3] !== 'red-peg') {
      revealCode()
      setTimeout(function() {
        alert('Game over.')
        if (confirm('Would you like to play again?')) {
          resetGame()
        }
      }, 500)
    }
  }

  function revealCode() {
    return codeSequence.map(peg => peg.className = peg.getAttribute('value'))
  }
  
  function resetGame() {
    i = 0
    chosenColors.clear()
    generateCode()
    // spacesInPlay = []
    // scoreSpacesInPlay = []
    spaces.forEach(space => space.className = 'empty-space')
    scoreSpaces.forEach(scoreSpace => scoreSpace.className = 'empty-score')
    codeSequence.forEach(codeSpace => codeSpace.className = 'hidden-space')
    resetRound() //! or playGame() & leave in comments above
  }

  // event handlers
  colors.forEach(color => color.addEventListener('click', selectColor))
  submitBtn.addEventListener('click', reviewCode)
  newGameBtn.addEventListener('click', playGame)
  resetGameBtn.addEventListener('click', resetGame)


}

window.addEventListener('DOMContentLoaded', init)