function init() {

  //  DOM variables
  const playerGrid = document.querySelector('.player-grid')
  let spaces = []
  const scoreGrid = document.querySelector('.score-grid')
  const code = document.querySelector('.code')
  const wrapper = document.querySelector('.wrapper')
  let codeSequence = []
  const colors = document.querySelectorAll('.color')
  const submitBtn = document.querySelector('#submit')
  const newGameBtn = document.querySelector('#start-game')
  const resetGameBtn = document.querySelector('#reset-game')
  const sliderBtns = document.querySelectorAll('.button')
  const dupSlider = document.querySelector('#dup-slider')
  const plyrSlider = document.querySelector('#plyr-slider')
  const codeLength = document.querySelector('#length')
  const players = document.querySelectorAll('.players')
  const plyr1Score = document.querySelector('#player1')
  const plyr2Score = document.querySelector('#player2')
    
  // game variables
  let width = 0
  const height = 10
  let selectedColor = null
  let spacesInPlay = []
  let scoreSpacesInPlay = []
  let duplicatesAllowed = null
  let i = 0
  let m = 0
  const availableColors = ['green', 'purple', 'orange', 'teal', 'yellow', 'pink', 'grey', 'red']
  const chosenColors = new Set
  let duplicateCode = []
  let selectedColors = []
  let score = []
  let twoPlayers = null
  let gameCount = 1
  let roundCount = 1
  let playerOne = 0
  let playerTwo = 0
  let currentPlayer = 'One'
  let tiebreaker = false
  let gameWon = false

  wrapper.style.display = 'none'
  players.forEach(player => player.style.display = 'none')
  dupSlider.style.justifyContent = 'flex-start'
  plyrSlider.style.justifyContent = 'flex-start'


  // creates player, result and code grids

  // player grid
  function generatePlayerGrid () {
    Array(width * height).join('.').split('.').forEach(() => {
      const space = document.createElement('div')
      space.classList.add('empty-space')
      spaces.push(space)
      playerGrid.appendChild(space)
    })
    playerGrid.style.width = `${width * 40}px`
  }

  // score grid
  function generateScoreGrid () {
    Array(height).join('.').split('.').forEach(() => {
      const scoreCluster = document.createElement('div')
      scoreCluster.classList.add('score-cluster')
      for (let i = 0; i < width; i++) {
        const scoreSpace = document.createElement('div')
        scoreSpace.classList.add('empty-score')
        scoreCluster.appendChild(scoreSpace)
      }
      scoreGrid.appendChild(scoreCluster)
    })
  
    const scoreSection = document.querySelectorAll('.score-cluster')
    scoreSection.forEach(score => {
      if (width >= 7) {
        score.style.width = '78px'
      } else if (width >= 5) {
        score.style.width = '58px'
      }
    })
  }

  // code grid
  function generateCodeGrid() {
    Array(width * 1).join('.').split('.').forEach(() => {
      const codeSpace = document.createElement('div')
      codeSpace.classList.add('hidden-space')
      codeSequence.push(codeSpace)
      code.appendChild(codeSpace)
    })
  }
 
  // functions

  // gets which color was clicked on and listens out of another click on spaces in play
  function selectColor(e) {
    selectedColor = e.target.getAttribute('alt')
    spacesInPlay.forEach(spaceInPlay => spaceInPlay.addEventListener('click', insertColor))
  }

  // changes color of space in play
  function insertColor(e) {
    if (spacesInPlay.includes(e.target)) e.target.className = (`${selectedColor}`) // gives element only one class of color
  }
  
  function playGame() {
    width = codeLength.value
    generatePlayerGrid()
    generateScoreGrid()
    generateCodeGrid()
    wrapper.style.display = 'flex'
    activateRow()
    duplicatesAllowed === 'flex-end' ? generateDuplicateCode() : generateCode()
    newGameBtn.style.display = 'none'
  }

  function activateRow() {
    if (i > ((width * height) - 1)) return // stops squresInPlay running if last round
    const n = i + (width - 1)
    for (i; i <= n; i++) {
      spacesInPlay.push(spaces[i]) 
    }  
    for (let r = 0; r <= (width - 1); r++) {
      scoreSpacesInPlay.push(scoreGrid.children[m].children[r])
    }
    spacesInPlay.forEach(space => {
      space.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    })
    m++
  }
  
  function generateCode() {
    while (chosenColors.size < width) {
      //! add comment - use array from the start if duplicates are allowed
      chosenColors.add(availableColors[Math.floor(Math.random() * 8)])
    }
    const colorsArray = [...chosenColors]
    return codeSequence.map((item, p) => item.setAttribute('value', colorsArray[p]))
  }

  function generateDuplicateCode() {
    while (duplicateCode.length < width) {
      duplicateCode.push(availableColors[Math.floor(Math.random() * 8)])
    }
    return codeSequence.map((item, p) => item.setAttribute('value', duplicateCode[p]))
  }
    
  function checkResult() {
    duplicatesAllowed === 'flex-end' ? determineResult() : checkForDuplicates()
  }

  function checkForDuplicates() {
    const colorsArray = []
    spacesInPlay.forEach(space => {
      colorsArray.push(space.className)
    })
    const colorsSet = new Set(colorsArray)

    if (colorsSet.size === parseInt(width) && !colorsSet.has('empty-space')) {
      determineResult() 
    } else {
      alert('Error. Your selection includes a duplicate or empty space.')
    }
  }

  function determineResult() {
    calculateScore()
    displayScore()
    winOrLose()
    resetRound()
  }

  // checks for each of the code colors - if they completely match it returns red, if they don't completely match it checks if the color is in guess code at all, returns white if yes.
  function calculateScore() {
    spacesInPlay.forEach(spaceInPlay => selectedColors.push(spaceInPlay.getAttribute('class')))
    for (let i = 0; i < width; i++) {
      const codeColor = codeSequence[i].getAttribute('value')
      const guessedColor = spacesInPlay[i].getAttribute('class')
      if (codeColor === guessedColor) {
        score.push('red-peg')
      } else if (selectedColors.includes(codeColor)) {
        score.push('white-peg')
        const index = selectedColors.indexOf(codeColor)
        selectedColors.splice(index, 1)
      }
    }
  }

  function displayScore() {
    score.sort()
    const newArray = scoreSpacesInPlay.map((scoreSpace, i) => { // which method??
      while (i < score.length) {
        return scoreSpace.className = score[i]
      }
    })
    return newArray
  }

  function winOrLose() {
    if (score[width - 1] === 'red-peg') {
      revealCode()
      setTimeout(function() {
        alert('You have won the game!!')
        if (twoPlayers === 'flex-end') {
          addScore()
          twoPlayerResult()
        } else {
          playAgain()   
        }
      }, 500)
    } else if (i > ((width * height) - 1) && score[width - 1] !== 'red-peg') {
      revealCode()
      setTimeout(function() {
        alert('Game over.')
        twoPlayers === 'flex-start' ? playAgain() : twoPlayerResult()   
      }, 500)
    }
  }

  // resets arrays after round, activates next row up and restarts round
  function resetRound() {
    spacesInPlay.forEach(space => {
      space.style.backgroundColor = 'rgb(0, 0, 0)'
    }) 
    spacesInPlay = []
    scoreSpacesInPlay = []
    selectedColors = []
    score = []
    activateRow()   
  }

  function revealCode() {
    return codeSequence.map(peg => peg.className = peg.getAttribute('value'))
  }  

  function playAgain() {
    if (confirm('Would you like to play again?')) resetGame()
  }

  function resetGame() {
    code.innerHTML = ''
    playerGrid.innerHTML = ''
    scoreGrid.innerHTML = ''
    spaces = []
    spacesInPlay = []
    scoreSpacesInPlay = []
    codeSequence = []
    i = 0
    m = 0
    chosenColors.clear()
    duplicateCode = []
    selectedColors = []
    score = []
      
    if (twoPlayers === 'flex-start') { //! twoPlayers === true
      players.forEach(player => player.style.display = 'none')
      playGame()
    } else {
      twoPlayerRound()
    }    
  }

  function whichReset() {
    duplicatesAllowed = dupSlider.style.justifyContent
    twoPlayers = plyrSlider.style.justifyContent //! store as true or false for readability
    if (twoPlayers === 'flex-start') {
      resetGame()
    } else {
      twoPlayerReset() 
      resetGame()
    }
  }

  function moveSlider(e) {
    if (e.target.parentElement.style.justifyContent === 'flex-start') {
      e.target.parentElement.style.justifyContent = 'flex-end'
    } else {
      e.target.parentElement.style.justifyContent = 'flex-start'
    }
  }

  //! !!!!!!!!!!!!!!!! two player mode !!!!!!!!!!!!!!!!!!!!!!!!!

  function determineGameMode() {
    duplicatesAllowed = dupSlider.style.justifyContent
    twoPlayers = plyrSlider.style.justifyContent
    twoPlayers === 'flex-start' ? playGame() : twoPlayerRound()    
  }

  function twoPlayerRound() {
    players.forEach(player => player.style.display = '')
    playGame()
    setTimeout(function() {
      alert(`Round ${roundCount}: Player ${currentPlayer}'s turn.`)
    }, 100)
  }

  function addScore() {
    if (gameCount % 2 === 0) {
      playerTwo++
      plyr2Score.innerHTML = playerTwo
    } else {
      playerOne++
      plyr1Score.innerHTML = playerOne
    }
  }

  function twoPlayerResult() {
    checkForWinner()
    tiebreakerWinner()
    if (gameWon === true) {
      gameWon = false
      return
    }
    endRound()
  }

  function checkForWinner() {
    if (playerOne === 5 && playerTwo === 5) {
      alert('Tiebreaker Round')
      tiebreaker = true
    } else if (playerOne === 5 && playerTwo === 4 && gameCount % 2 === 0) {
      alert('Player 1 wins!')
      gameWon = true
      twoPlayerReset()
      playAgain()
    } else if (playerTwo === 5 && playerTwo > playerOne) {
      alert('Player 2 wins!')
      gameWon = true
      twoPlayerReset()
      playAgain()
    } else if (playerOne === 5 && playerTwo < 4 && gameCount % 2 !== 0) {
      alert('Player 1 wins!')
      gameWon = true
      twoPlayerReset()
      playAgain()
    }
  }

  function tiebreakerWinner() {
    if (tiebreaker === true && gameCount % 2 === 0) {
      if (playerOne > playerTwo) {
        alert('Player 1 wins!')
        gameWon = true
        twoPlayerReset()
        playAgain()
      } else if (playerTwo > playerOne) {
        alert('Player 2 wins')
        gameWon = true
        twoPlayerReset()
        playAgain()
      }
    }
  }

  function endRound() {
    resetGame()
    if (gameCount % 2 === 0) {
      currentPlayer = 'One'
      roundCount++
    } else {
      currentPlayer = 'Two'
    }
    gameCount++
  }
  
  function twoPlayerReset() {
    gameCount = 1
    roundCount = 1
    tiebreaker = false
    playerOne = 0
    playerTwo = 0
    currentPlayer = 'One'
    plyr1Score.innerHTML = ''
    plyr2Score.innerHTML = ''
  }

  // event handlers
  newGameBtn.addEventListener('click', determineGameMode)
  colors.forEach(color => color.addEventListener('click', selectColor))
  submitBtn.addEventListener('click', checkResult)
  resetGameBtn.addEventListener('click', whichReset)
  sliderBtns.forEach(slider => slider.addEventListener('click', moveSlider))

}

window.addEventListener('DOMContentLoaded', init)

//! once reset console .code is empty string

//! change names of functions/variables to more meaningful names
//! see if array method is easier option
//! check what each function does - if it is more than one thing -> separate
//! where repeated try to add into a function instead of typing out same code
//! is 'm' variable needed
//! is there better way of organising two player mode
//! remove if statements from inside others and put into functions
