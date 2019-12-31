function init() {

  //  DOM variables
  const grid = document.querySelector('.grid')
  const spaces = []

  // game variables
  const width = 4
  const height = 10

  // loop as many times as width multiplied by height to fill the grid with spaces
  Array(width * height).join('.').split('.').forEach(() => {
    const space = document.createElement('div')
    space.classList.add('grid-item')
    spaces.push(space)
    grid.appendChild(space)
  })
  
}

window.addEventListener('DOMContentLoaded', init)