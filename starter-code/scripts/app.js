function init() {

  //  DOM variables
  const playerGrid = document.querySelector('.player-grid')
  let spaces = []
  const scoreGrid = document.querySelector('.score-grid')
  const code = document.querySelector('.code')
  const wrapper = document.querySelector('.wrapper')
  const wrapperTwo = document.querySelector('.wrapper2')
  const body = document.querySelector('body')
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
  const header = document.querySelector('h1')
  const overlay = document.querySelector('#overlay-container')

  // game variables
  let width = 0
  const height = 10
  let selectedColor = null
  let spacesInPlay = []
  let scoreSpacesInPlay = []
  let duplicatesAllowed = null
  let i = 0
  let m = 0
  const availableColors = ['green', 'purple', 'orange', 'teal', 'yellow', 'pink', 'white', 'red']
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
  resetGameBtn.style.display = 'none'
  body.style.flexDirection = 'column'
  players.forEach(player => player.style.display = 'none')
  dupSlider.style.justifyContent = 'flex-start'
  plyrSlider.style.justifyContent = 'flex-start'



  // creates player, result and code grids

  // player grid
  function generatePlayerGrid() {
    Array(width * height).join('.').split('.').forEach(() => {
      const space = document.createElement('div')
      space.classList.add('empty-space')
      spaces.push(space)
      playerGrid.appendChild(space)
    })
    playerGrid.style.width = `${width * 40}px`
  }

  // score grid
  function generateScoreGrid() {
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
    wrapper.style.display = 'flex' //! remove these from here
    header.style.display = 'none'
    wrapperTwo.style.width = '100vw'
    body.style.flexDirection = ''
    body.style.alignItems = ''
    resetGameBtn.style.display = 'block'

    activateRow()
    duplicatesAllowed === 'flex-end' ? generateDuplicateCode() : generateCode()
    newGameBtn.style.display = 'none'
  }

  function activateRow() {
    if (i > ((width * height) - 1)) return // stops squresInPlay running if last round
    const n = i + (width - 1)
    for (i; i <= n; i++) spacesInPlay.push(spaces[i])
    for (let i = 0; i <= (width - 1); i++) scoreSpacesInPlay.push(scoreGrid.children[m].children[i])
    spacesInPlay.forEach(space => space.style.backgroundColor = 'rgba(0, 0, 0, 0.5)')
    m++
  }

  function generateCode() {
    while (chosenColors.size < width) chosenColors.add(availableColors[Math.floor(Math.random() * 8)])
    //! add comment - use array from the start if duplicates are allowed
    const colorsArray = [...chosenColors]
    return codeSequence.map((item, p) => item.setAttribute('value', colorsArray[p]))
  }

  function generateDuplicateCode() {
    while (duplicateCode.length < width) duplicateCode.push(availableColors[Math.floor(Math.random() * 8)])
    return codeSequence.map((item, p) => item.setAttribute('value', duplicateCode[p]))
  }

  function checkResult() {
    duplicatesAllowed === 'flex-end' ? determineResult() : checkForDuplicates()
  }

  function checkForDuplicates() {
    const colorsArray = []
    spacesInPlay.forEach(space => colorsArray.push(space.className))
    const colorsSet = new Set(colorsArray)
    colorsSet.size === parseInt(width) && !colorsSet.has('empty-space') ?
      determineResult() : alert('Error. Your selection includes a duplicate or empty space.')
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
    const lineScore = scoreSpacesInPlay.map((scoreSpace, i) => { // which method??
      while (i < score.length) return scoreSpace.className = score[i]
    })
    return lineScore
  }

  function winOrLose() { //! break up this function and rename
    if (score[width - 1] === 'red-peg') {
      revealCode()
      youWin()
      setTimeout(function () {
        // alert('You have won the game!!')
        if (twoPlayers === 'flex-end') {
          addScore()
          twoPlayerResult()
        } else {
          playAgain()
        }
      }, 500)
    } else if (i > ((width * height) - 1) && score[width - 1] !== 'red-peg') {
      revealCode()
      gameOver()
      setTimeout(function () {
        // alert('Game over.')
        twoPlayers === 'flex-start' ? playAgain() : twoPlayerResult()
      }, 500)
    }
  }

  // resets arrays after round, activates next row up and restarts round
  function resetRound() {
    spacesInPlay.forEach(space => space.style.backgroundColor = 'rgb(0, 0, 0)')
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
    setTimeout(function () {
      if (confirm('Would you like to play again?')) {
        overlay.style.display = 'none'
        determineReset()
      }
    }, 100)
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
  }

  function determineReset() {
    duplicatesAllowed = dupSlider.style.justifyContent
    twoPlayers = plyrSlider.style.justifyContent //! store as true or false for readability
    if (twoPlayers === 'flex-start') {
      resetGame()
      players.forEach(player => player.style.display = 'none')
      playGame()
    } else {
      twoPlayerReset()
      resetGame()
      twoPlayerRound()
    }
  }

  function moveSlider(e) {
    e.target.parentElement.style.justifyContent === 'flex-start' ?
      e.target.parentElement.style.justifyContent = 'flex-end' : e.target.parentElement.style.justifyContent = 'flex-start'
  }

  // two player mode functions

  function determineGameMode() {
    duplicatesAllowed = dupSlider.style.justifyContent
    twoPlayers = plyrSlider.style.justifyContent
    twoPlayers === 'flex-start' ? playGame() : twoPlayerRound()
  }

  function twoPlayerRound() {
    players.forEach(player => player.style.display = '')
    playGame()
    if (gameCount === 1) {
      setTimeout(function () {
        alert(`Round ${roundCount}: Player ${currentPlayer}'s turn.`)
      }, 100)
    }
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
      tieBreakerAlert()
      // alert('Tiebreaker Round')
      tiebreaker = true
    } else if (playerOne === 5 && playerTwo === 4 && gameCount % 2 === 0) {
      playerOneWins()
      // alert('Player 1 wins!')
      gameWon = true
      twoPlayerReset()
      playAgain()
    } else if (playerTwo === 5 && playerTwo > playerOne) {
      playerTwoWins
      // alert('Player 2 wins!')
      gameWon = true
      twoPlayerReset()
      playAgain()
    } else if (playerOne === 5 && playerTwo < 4 && gameCount % 2 !== 0) {
      playerOneWins()
      // alert('Player 1 wins!')
      gameWon = true
      twoPlayerReset()
      playAgain()
    }
  }

  function tiebreakerWinner() {
    if (tiebreaker === true && gameCount % 2 === 0) { //! add second if statement to conditions of first?
      if (playerOne > playerTwo) {
        playerOneWins()
        // alert('Player 1 wins!')
        gameWon = true
        twoPlayerReset()
        playAgain()
      } else if (playerTwo > playerOne) {
        playerTwoWins()
        // alert('Player 2 wins!')
        gameWon = true
        twoPlayerReset()
        playAgain()
      }
    }
  }

  function endRound() {
    setTimeout(function () {
      alert(`Round ${roundCount}: Player ${currentPlayer}'s turn.`)
      overlay.style.display = 'none'
      resetGame()
      twoPlayerRound()
    }, 100)
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

  function removeOverlay() {
    if (overlay.style.display === 'flex') overlay.style.display = 'none'
  }

  function gameOver() {
    overlay.firstElementChild.innerHTML = 'GAME OVER'
    overlay.firstElementChild.style.color = 'red'
    overlay.style.display = 'flex'
  }

  function youWin() {
    overlay.firstElementChild.innerHTML = 'YOU WIN'
    overlay.firstElementChild.style.color = 'lime'
    overlay.style.display = 'flex'
  }

  function playerOneWins() {
    overlay.firstElementChild.innerHTML = 'PLAYER 1 WINS'
    overlay.firstElementChild.style.color = 'lime'
    overlay.style.display = 'flex'
  }

  function playerTwoWins() {
    overlay.firstElementChild.innerHTML = 'PLAYER 2 WINS'
    overlay.firstElementChild.style.color = 'lime'
    overlay.style.display = 'flex'
  }

  function tieBreakerAlert() {
    overlay.firstElementChild.innerHTML = 'TIEBREAKER'
    overlay.firstElementChild.style.color = 'cadetblue'
    overlay.style.display = 'flex'
  }

  // event handlers
  newGameBtn.addEventListener('click', determineGameMode)
  colors.forEach(color => color.addEventListener('click', selectColor))
  submitBtn.addEventListener('click', checkResult)
  resetGameBtn.addEventListener('click', determineReset)
  sliderBtns.forEach(slider => slider.addEventListener('click', moveSlider))
  overlay.addEventListener('click', removeOverlay)

}

window.addEventListener('DOMContentLoaded', init)

//! once reset console .code has empty string

//! change names of functions/variables to more meaningful names
//! see if array method is easier option
//! check what each function does - if it is more than one thing -> separate
//! where repeated try to add into a function instead of typing out same code
//! rename m, n and one letter variables
//! is there better way of organising two player mode
//! remove if statements from inside others and put into functions
