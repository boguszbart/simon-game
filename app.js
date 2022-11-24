const topLeft = document.querySelector('#tl')
const topRight = document.querySelector('#tr')
const bottomLeft = document.querySelector('#bl')
const bottomRight = document.querySelector('#br')
const powerCheckbox = document.querySelector('#on')
const strictCheckbox = document.querySelector('#strict')
const startBtn = document.querySelector('#start')
const turnCounter = document.querySelector('#turn')
const colors = document.querySelectorAll('.colors')
const audio1 = document.querySelector('#clip1')
const audio2 = document.querySelector('#clip2')
const audio3 = document.querySelector('#clip3')
const audio4 = document.querySelector('#clip4')

const possibleClicks = ['tr', 'br', 'bl', 'tl']
let count = 0
let clickNumber = 0
let randomClicks = []
let playerClicks = []
let timeouts = []

// shows sequence
const showRandomClicks = () => {
	turnCounter.textContent = count
	randomClicks.forEach((click, index) => {
		timeouts.push(
			setTimeout(() => {
				handleSounds(click)
				handleColors(click)
			}, index * 1000)
		)
	})
}

// extends sequence
const handleRandomClicks = () => {
	randomClicks.push(possibleClicks[Math.floor(Math.random() * possibleClicks.length)])
	showRandomClicks()
}

// checks if the player is clicking correctly according to the random sequence
const compareClicks = playerClickNumber => {
	// if strict mode is enabled
	if (!(playerClicks[playerClickNumber] == randomClicks[playerClickNumber]) && strictCheckbox.checked) {
		turnCounter.textContent = 'LOST'
		setTimeout(resetGame,1000)
	}
	// if player clicks the wrong button
	else if (!(playerClicks[playerClickNumber] == randomClicks[playerClickNumber])) {
		turnCounter.textContent = 'NO!'
		playerClicks = []
		for (i = 0; i < timeouts.length; i++) {
			clearTimeout(timeouts[i])
		}
		// clickNumber is set to -1 to start comparing arrays with index 0
		clickNumber = -1
		setTimeout(() => {
			showRandomClicks()
			turnCounter.textContent = count
		}, 1000)
	}
	// if player clicks the right button
	else if (
		playerClicks[playerClicks.length - 1] == randomClicks[randomClicks.length - 1] &&
		playerClicks.length == randomClicks.length
	) {
		setTimeout(() => {
			handleRandomClicks()
		}, 1000)
		clickNumber = -1
		playerClicks = []
		count++
	}
}

// changes color for a short period of time
const handleColors = click => {
	let currentDiv
	let newColor

	if (click == 'tl') {
		currentDiv = topLeft
		newColor = 'rgb(0, 180, 0)'
	} else if (click == 'br') {
		currentDiv = bottomRight
		newColor = 'rgb(11, 225, 253)'
	} else if (click == 'bl') {
		currentDiv = bottomLeft
		newColor = 'rgb(255,233,137)'
	} else {
		currentDiv = topRight
		newColor = 'rgb(190, 0, 0)'
	}

	const currentColor = window.getComputedStyle(currentDiv).getPropertyValue('background-color')
	currentDiv.style.backgroundColor = newColor
	setTimeout(() => {
		currentDiv.style.backgroundColor = currentColor
	}, 300)
}

// specifies which sound should be played
const handleSounds = click => {
	click == 'tl' ? audio1.play() : click == 'br' ? audio2.play() : click == 'bl' ? audio3.play() : audio4.play()
}

// resets game
const resetGame = () => {
	turnCounter.textContent = ''
	count = 0
	randomClicks = []
	playerClicks = []
}

//starts game
const gameStart = () => {
	if (powerCheckbox.checked) {
		resetGame()
		count++
		turnCounter.textContent = count
		handleRandomClicks()
	}
}

//handles power button
const powerOn = () => {
	if (powerCheckbox.checked) {
		turnCounter.textContent = '-'
	} else {
		resetGame()
		turnCounter.textContent = ''
	}
}

// eventListeners

startBtn.addEventListener('click', gameStart)

colors.forEach(color => {
	color.addEventListener('click', () => {
		if (powerCheckbox.checked) {
			playerClicks.push(color.id)
			handleSounds(color.id)
			handleColors(color.id)
			console.log(randomClicks)
			console.log(playerClicks)
			compareClicks(clickNumber)
			clickNumber++
		}
	})
})

powerCheckbox.addEventListener('click', powerOn)
