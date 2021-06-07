function init() {

  //  DOM variables
  const gameContainer = document.querySelector('.game-container')
  const playerGrid = document.querySelector('.player-grid')
  let spaces = []
  const scoreGrid = document.querySelector('.score-grid')
  const code = document.querySelector('.code')
  const wrapper = document.querySelector('.wrapper')
  const options = document.querySelector('.options')
  const body = document.querySelector('body')
  const buttons = document.querySelectorAll('button')
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

  // creates holiding page
  gameContainer.style.display = 'none'
  resetGameBtn.style.display = 'none'
  players.forEach(player => player.style.display = 'none')
  dupSlider.style.justifyContent = 'flex-start'
  plyrSlider.style.justifyContent = 'flex-start'
  wrapper.style.flexDirection = 'column'

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

  // starts one player or two player mode depending on what user has selected
  function determineGameMode() {
    duplicatesAllowed = dupSlider.style.justifyContent
    twoPlayers = plyrSlider.style.justifyContent
    twoPlayers === 'flex-start' ? playGame() : twoPlayerRound()
  }

  function playGame() {
    width = codeLength.value // stores code length user has selected
    generatePlayerGrid()
    generateScoreGrid()
    generateCodeGrid()
    showGame()
    activateRow()
    duplicatesAllowed === 'flex-end' ? generateDuplicateCode() : generateCode()
  }

  // removes holding page and displays game page
  function showGame() {
    gameContainer.style.display = 'flex'
    header.style.display = 'none'
    options.style.backgroundColor = 'rgba(95, 158, 160, 0.75)'
    buttons.forEach(button => button.style.color = 'cadetblue')
    wrapper.style.flexDirection = 'row'
    resetGameBtn.style.display = 'block'
    newGameBtn.style.display = 'none'
    sliderBtns.forEach(button => button.style.backgroundColor = 'white')
    body.style.backgroundImage = 'url(assets/background.jpeg)'
  }

  // activates which spaces are in play and can be affected
  function activateRow() {
    if (i > ((width * height) - 1)) return // stops function running if last round of game
    const n = i + (width - 1) // calculates where end of row is (i  = start of row)
    for (i; i <= n; i++) spacesInPlay.push(spaces[i])
    for (let i = 0; i <= (width - 1); i++) {
      scoreSpacesInPlay.push(scoreGrid.children[m].children[i]) // activates result square and all divs inside
    }
    m++
    spacesInPlay.forEach(space => space.style.backgroundColor = 'rgba(50, 50, 50, 0.7)')
  }

  // generates random color code sequence with no duplicates (currently hidden)
  function generateCode() {
    while (chosenColors.size < width) chosenColors.add(availableColors[Math.floor(Math.random() * 8)]) // used set to ensure no duplicates
    const colorsArray = [...chosenColors]
    return codeSequence.map((item, i) => item.setAttribute('value', colorsArray[i]))
  }

  // generates random color code sequence with possible duplicates (currently hidden)
  function generateDuplicateCode() {
    while (duplicateCode.length < width) duplicateCode.push(availableColors[Math.floor(Math.random() * 8)]) // used array to allow duplicates
    return codeSequence.map((item, i) => item.setAttribute('value', duplicateCode[i]))
  }

  // stores color that was clicked and listens for another click on a space in play
  function selectColor(e) {
    selectedColor = e.target.getAttribute('alt')
    spacesInPlay.forEach(spaceInPlay => spaceInPlay.addEventListener('click', insertColor))
  }

  // changes color of space in play
  function insertColor(e) {
    if (spacesInPlay.includes(e.target)) e.target.className = (`${selectedColor}`) // ensures space has only one class (removes empty space class)
  }

  function checkResult() {
    duplicatesAllowed === 'flex-end' ? determineResult() : checkForDuplicates()
  }

  // alerts user if there are duplicates or empty spaces in their submitted code
  function checkForDuplicates() {
    const playerColors = []
    spacesInPlay.forEach(space => playerColors.push(space.className))
    const colorsSet = new Set(playerColors) // filters out any duplicates
    colorsSet.size === parseInt(width) && !colorsSet.has('empty-space') ? // if set is shorter than expected code length, there must have be a duplicate
      determineResult() : alert('Error. Your selection includes a duplicate or empty space.')
  }

  function determineResult() {
    calculateScore()
    displayScore()
    winOrLose()
    resetRound()
  }

  // 
  function calculateScore() {
    spacesInPlay.forEach(spaceInPlay => selectedColors.push(spaceInPlay.getAttribute('class')))
    for (let i = 0; i < width; i++) {
      const codeColor = codeSequence[i].getAttribute('value') // stores generated code color at each position
      const guessedColor = spacesInPlay[i].getAttribute('class') // stores player selected color at each position
      if (codeColor === guessedColor) { // colors at position match
        score.push('red-peg') 
      } else if (selectedColors.includes(codeColor)) { // if generated color appears anywhere in selected colors
        score.push('white-peg') 
        const index = selectedColors.indexOf(codeColor)
        selectedColors.splice(index, 1) // ensures multiple points are not received for one color
      }
    }
  }

  function displayScore() {
    score.sort() // stop score from displaying in order of sequence
    const lineScore = scoreSpacesInPlay.map((scoreSpace, i) => {
      while (i < score.length) return scoreSpace.className = score[i]
    })
    return lineScore
  }

  // checks for if the player has won or if they have run out of turns
  function winOrLose() {
    if (score[width - 1] === 'red-peg') { // stops game if player guesses code (all red pegs)
      revealCode()
      youWin()
      setTimeout(function () {
        if (twoPlayers === 'flex-end') {
          addScore()
          twoPlayerResult()
        } else {
          playAgain()
        }
      }, 500)
    } else if (i > ((width * height) - 1) && score[width - 1] !== 'red-peg') { // stops game if they reach last row and do not submit correct code
      revealCode()
      gameOver()
      setTimeout(function () {
        twoPlayers === 'flex-start' ? playAgain() : twoPlayerResult()
      }, 500)
    }
  }

  function revealCode() {
    return codeSequence.map(peg => peg.className = peg.getAttribute('value')) // transfer color from value to class to reveal
  }

  function playAgain() {
    setTimeout(function () {
      if (confirm('Would you like to play again?')) {
        overlay.style.display = 'none'
        determineReset()
      }
    }, 100)
  }

  function resetRound() {
    spacesInPlay.forEach(space => space.style.backgroundColor = 'rgb(0, 0, 0)')
    spacesInPlay = []
    scoreSpacesInPlay = []
    selectedColors = []
    score = []
    activateRow()
  }

  function determineReset() {
    duplicatesAllowed = dupSlider.style.justifyContent
    twoPlayers = plyrSlider.style.justifyContent
    if (twoPlayers === 'flex-start') {
      resetGame()
      players.forEach(player => player.style.display = 'none') // if one player mode - removes player score elements
      playGame()
    } else {
      twoPlayerReset()
      resetGame()
      twoPlayerRound()
    }
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

  // two player mode functions

  function twoPlayerRound() {
    players.forEach(player => player.style.display = '') // shows player score elements
    wrapper.style.height = '40vw'
    playGame()
    if (gameCount === 1) {
      setTimeout(function () {
        alert(`Round ${roundCount}: Player ${currentPlayer}'s turn.`) // displays on first round only
      }, 100)
    }
  }

  // only runs if player wins a round - adds 1 to their score
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
      return // stops round from resetting if game has been won (game is over)
    }
    endRound()
  }

  // checks if either player has reached 5 (won games) before other player - if both reach 5 in same round tiebreaker round runs until someone wins
  function checkForWinner() {
    if (playerOne === 5 && playerTwo === 5) {
      tieBreakerAlert()
      tiebreaker = true
    } else if (playerOne === 5 && playerTwo === 4 && gameCount % 2 === 0) {
      playerOneWins()
      gameWon = true
      twoPlayerReset()
      playAgain()
    } else if (playerTwo === 5 && playerTwo > playerOne) {
      playerTwoWins()
      gameWon = true
      twoPlayerReset()
      playAgain()
    } else if (playerOne === 5 && playerTwo < 4 && gameCount % 2 !== 0) {
      playerOneWins()
      gameWon = true
      twoPlayerReset()
      playAgain()
    }
  }

  // checks for winner (player 1 point up) at end of tiebreaker round
  function tiebreakerWinner() {
    if (tiebreaker === true && gameCount % 2 === 0) { 
      if (playerOne > playerTwo) {
        playerOneWins()
        gameWon = true
        twoPlayerReset()
        playAgain()
      } else if (playerTwo > playerOne) {
        playerTwoWins()
        gameWon = true
        twoPlayerReset()
        playAgain()
      }
    }
  }

  function endRound() {
    setTimeout(function () {
      alert(`Round ${roundCount}: Player ${currentPlayer}'s turn.`)
      overlay.style.display = 'none' // removes win/lose page from previous round
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

  // overlay functions - display win/lose pages

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

  function removeOverlay() {
    if (overlay.style.display === 'flex') overlay.style.display = 'none'
  }

  // moves slider to opposite side when clicked
  function moveSlider(e) {
    e.target.parentElement.style.justifyContent === 'flex-start' ?
      e.target.parentElement.style.justifyContent = 'flex-end' : e.target.parentElement.style.justifyContent = 'flex-start'
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

