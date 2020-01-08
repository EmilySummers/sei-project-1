function init() {

  //  DOM variables
  const playerGrid = document.querySelector('.player-grid')
  let spaces = []
  const scoreGrid = document.querySelector('.score-grid')
  let scoreCluster = document.querySelector('.score-cluster')
  const scoreSpaces = []
  let code = document.querySelector('.code')
  const codeRow = document.querySelector('.code-row')
  const wrapper = document.querySelector('.wrapper')
  let codeSequence = []
  const colors = document.querySelectorAll('.color')
  let selectedColor = null
  let spacesInPlay = []
  let scoreSpacesInPlay = []
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
  
  // dupSlider.style.justifyContent = 'flex-start' //! move/acces from start

  //! make spaces (not in play) faded and spacesInPlay current color
  
  
  // game variables
  let width = 0
  const height = 10
  let score = []
  const availableColors = ['green', 'purple', 'orange', 'teal', 'yellow', 'pink', 'grey', 'red']
  const chosenColors = new Set
  let selectedColors = []
  let i = 0
  let duplicateCode = []
  let gameCount = 1
  let roundCount = 1
  let tiebreaker = false
  let playerOne = 0
  let playerTwo = 0
  let currentPlayer = 'One'


  wrapper.style.display = 'none'
  players.forEach(player => player.style.display = 'none')



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
  // let gridWidth = null
  // width > 4 ? gridWidth = 80 : gridWidth = 40
    
  // Array(gridWidth * (height / 10)).join('.').split('.').forEach(() => {
  //   const scoreSpace = document.createElement('div')
  //   scoreSpace.classList.add('empty-score')
  //   scoreSpaces.push(scoreSpace)
  //   scoreGrid.appendChild(scoreSpace)
  // })
  // scoreGrid.style.width = `${gridWidth}px`
  // code.style.marginRight = `${gridWidth}px`

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
  
  //! const newWidth = wrapper.style.width
  //! codeRow.style.width = `${newWidth}px`
  //! make code row align with player board

  // ${playerGrid.style.width + scoreGrid.style.width}px`
 
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
    width = codeLength.value
    generatePlayerGrid()
    generateScoreGrid()
    generateCodeGrid()
    wrapper.style.display = 'flex'
    activateRow()
    dupSlider.style.justifyContent === 'flex-end' ? generateDuplicateCode() : generateCode()
    newGameBtn.style.display = 'none'
  }

  let m = 0
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
      // do not convert to set (just use array from the start) if duplicates are allowed
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
    dupSlider.style.justifyContent === 'flex-end' ? reviewCode() : checkForDuplicates()
    
  }

  function checkForDuplicates() {
    const newArray = []
    spacesInPlay.forEach(space => {
      newArray.push(space.className)
    })
    const newSet = new Set(newArray)
    newSet.size === parseInt(width) ? reviewCode() : alert('Error. Your selection includes a duplicate or empty space.') //! seperate as one space passes it
  }

  // checks for each of the code colors - if they completely match it returns red, if they don't completely match it checks if the color is in guess code at all, returns white if yes.
  function reviewCode() {
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
    displayScore() //! move these functions
    winOrLose()
    resetRound()
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

  function winOrLose() {
    if (score[width - 1] === 'red-peg') {
      revealCode()
      setTimeout(function() {
        alert('You have won the game!!')
        if (plyrSlider.style.justifyContent === 'flex-end') {
          playerScore()
          twoPlayerResult()
        } else {
          playAgain()   
        }
      }, 500)

    } else if (i > ((width * height) - 1) && score[width - 1] !== 'red-peg') {
      revealCode()
      setTimeout(function() {
        alert('Game over.')
        plyrSlider.style.justifyContent === 'flex-start' ? playAgain() : twoPlayerResult()   
      }, 500)
    }
  }

  function playAgain() {
    if (confirm('Would you like to play again?')) {
      resetGame()
    }
  }

  


  

  function revealCode() {
    return codeSequence.map(peg => peg.className = peg.getAttribute('value'))
  }
  
  function resetGame() {
    i = 0
    m = 0
    spaces = []
    spacesInPlay = []
    scoreSpacesInPlay = []
    selectedColors = []
    score = []
    code.innerHTML = ''
    playerGrid.innerHTML = ''
    scoreGrid.innerHTML = ''
    chosenColors.clear()
    duplicateCode = []
    codeSequence = []
    // spaces.forEach(space => space.className = 'empty-space')
    // scoreSection.forEach(scoreSpace => scoreSpace.childNodes.forEach(array => array.className = 'empty-score'))
    // codeSequence.forEach(codeSpace => codeSpace.className = 'hidden-space')
    
    // playGame()    
    //! need to add two player version of play game so that reset button works
    plyrSlider.style.justifyContent === 'flex-start' ? playGame() : twoPlayerMode() 
    console.log(gameCount) 
  }

  dupSlider.style.justifyContent = 'flex-start'
  plyrSlider.style.justifyContent = 'flex-start'

  function moveSlider(e) {
    if (e.target.parentElement.style.justifyContent === 'flex-start') {
      e.target.parentElement.style.justifyContent = 'flex-end'
    } else {
      e.target.parentElement.style.justifyContent = 'flex-start'
    }
  }

  //! !!!!!!!!!!!!!!!! two player mode !!!!!!!!!!!!!!!!!!!!!!!!!

  function playerMode() {
    plyrSlider.style.justifyContent === 'flex-start' ? playGame() : twoPlayerMode()    
  }

  function twoPlayerMode() {
    players.forEach(player => player.style.display = '')
    playGame()
    setTimeout(function() {
      alert(`Round ${roundCount}: Player ${currentPlayer}'s turn.`)
    }, 100)
  }

  function twoPlayerResult() {
    console.log(gameCount) 
    playerWins()
    tiebreakerRound()
    if (gameWon === true) {
      gameWon = false
      return
    }
    endRound()
    
    console.log('did not work')
    
  }

  let gameWon = false
  function twoPlayerEnd() {
    gameCount = 1
    roundCount = 1
    tiebreaker = false
    playerOne = 0
    playerTwo = 0
    currentPlayer = 'One'
    plyr1Score.innerHTML = ''
    plyr2Score.innerHTML = ''
    gameWon = true
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
    console.log(gameCount) 
  }

  function playerScore() {
    if (gameCount % 2 === 0) {
      playerTwo++
      plyr2Score.innerHTML = playerTwo
      console.log(`player 2: ${playerTwo}`)
    } else {
      playerOne++
      plyr1Score.innerHTML = playerOne
      console.log(`player 1: ${playerOne}`)
    }
  }

  function playerWins() {
    if (playerOne === 5 && playerTwo === 5) {
      alert('Tiebreaker Round')
      tiebreaker = true
    } else if (playerOne === 5 && playerTwo === 4 && gameCount % 2 === 0) {
      alert('Player 1 wins!')
      twoPlayerEnd()
      playAgain()
    } else if (playerTwo === 5 && playerTwo > playerOne) {
      alert('Player 2 wins!')
      twoPlayerEnd()
      playAgain()
    } else if (playerOne === 5 && playerTwo < 4 && gameCount % 2 !== 0) {
      alert('Player 1 wins!')
      twoPlayerEnd()
      playAgain()
    }

  }

  // if game count is odd and player 2 is less than 4 - player 1 wins

  function tiebreakerRound() {
    if (tiebreaker === true && gameCount % 2 === 0) {
      if (playerOne > playerTwo) {
        alert('Player 1 wins!')
        twoPlayerEnd()
        playAgain()
      } else if (playerTwo > playerOne) {
        alert('Player 2 wins')
        twoPlayerEnd()
        playAgain()
      }
    }
  }
  
  



  // event handlers
  colors.forEach(color => color.addEventListener('click', selectColor))
  submitBtn.addEventListener('click', checkResult)
  newGameBtn.addEventListener('click', playerMode)
  resetGameBtn.addEventListener('click', resetGame)
  sliderBtns.forEach(slider => slider.addEventListener('click', moveSlider))

  //! once reset console .code is empty string

}

window.addEventListener('DOMContentLoaded', init)