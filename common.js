const gameContainer = document.querySelector('.game-container');
const display = document.getElementById('display');
const keyboard = document.querySelector('.wrapper-keyboard');
const gameField = document.querySelector('.game-field');
const scoreBoard = document.querySelector('.score');
const bestScoreBoard = document.querySelector('.best-score');
const wrongAnswerText = document.querySelector('.wrong-answer');
const bonusAnswerText = document.querySelector('.bonus-answer');
const wave = document.querySelector('.wave');
const wave2 = document.querySelector('.wave-2');
const soundButton = document.getElementById('sound');
const fullscreenButton = document.getElementById('fullscreen');
const rainSound = document.querySelector('.rain-sound');
const seaSound = document.querySelector('.sea-sound');
const correctAnswerSound = document.querySelector('.correct-answer-sound');
const correctBonusAnswerSound = document.querySelector('.correct-bonus-answer-sound');
const wrongAnswerSound = document.querySelector('.wrong-answer-sound');
const fallInSeaSound = document.querySelector('.fall-in-sea-sound');
const popDropSound = document.querySelector('.pop-drop-sound');
const gameOverSound = document.querySelector('.game-over-sound');
const gameStatistic = document.querySelector('.game-statistic');
const scorePoints = document.querySelector('.score-points');
const totalEquations = document.querySelector('.total-equations');
const equationsPerMinute = document.querySelector('.equations-per-minute');
const overall = document.querySelector('.overall');
const startMenu = document.querySelector('.preload');
const gameOverTutorial = document.querySelector('.game-over-tutorial');
const btnWrapper = document.getElementsByClassName('number');

// Minimum and maximum values for random drop position
const limitPositionValue = {
  min: 1,
  max: 85,
};

// Minimum and maximum operand value depending on the level
const limitOperandValue = {
  level1: {
    min: 1,
    max: 10,
  },
  level2: {
    min: 2,
    max: 20,
  },
  level3: {
    min: 4,
    max: 30,
  },
  level4: {
    min: 6,
    max: 40,
  },
  level5: {
    min: 8,
    max: 60,
  },
};

// Maximum and minimum value for the interval of bonus drops creation
const creationBonusDropInterval = {
  min: 34365,
  max: 62735,
};

let resultArray = []; // Array for storing the results of calculation of drops
let dropsArray = []; // Array for storing the list of drop items
let durationAnimate = 9000; // Animation duration
let creationDropInterval = 3000; // Drop creation interval
let currentScore = 0; // Current score value
let baseChangeScore = 10; // The base value of the score change
let countCorrectAnswer = 0; // Counting correct answers
let countDrop = 1; // Counting the created drops
let countDropFallen = 0; // Counting the drops that have fallen into the sea
let healthPoints = 3; // Amount of health points
let enteredAnswer; // Entered answer
let correctAnswer; // Correct answer
let correctBonusAnswer; // Correct bonus answer
let isSoundOn; // Flag to determine whether sounds are to be played
let isCorrectAnswer; // Flag to determine the correctness of the answer
let isCorrectBonusAnswer; // Flag to determine the correctness of the bonus answer
let isGameOver = false; // Flag to determine the end of the game
let TutorialMode = false; // Flag to determine turn on/off for tutorial

// Function for changing the fall speed of the raindrop
function changeDropFallSpeed() {
  durationAnimate -= 250;
  creationDropInterval -= 70;

  if (durationAnimate <= 4000) {
    durationAnimate = 4000;
  }
  if (creationDropInterval <= 3000) {
    creationDropInterval = 3000;
  }
}



// Function for running the splash animation
function playSplashAnimation(index, elementName, splashName) {
  const timeShowDropSplash = 450;

  createSplash(index, elementName, splashName);
  if (isSoundOn) {
    popDropSound.currentTime = 0;
    popDropSound.play();
  }
  setTimeout(() => {
    try {
      gameField.removeChild(document.querySelector(`.${splashName}`));
    } catch (error) { }
  }, timeShowDropSplash);
}


// Function for getting a random value, taking into account the received range
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function for the appearance of a drop from a random location horizontally
function setRandomDropPosition(
  min = limitPositionValue.min,
  max = limitPositionValue.max
) {
  return getRandomValue(min, max);
}

// Function for setting a random operator value
function setRandomOperandValue() {
  let min;
  let max;

  if (countCorrectAnswer >= 0 && countCorrectAnswer < 50) {
    min = limitOperandValue.level1.min;
    max = limitOperandValue.level1.max;
  } else if (countCorrectAnswer >= 50 && countCorrectAnswer < 100) {
    min = limitOperandValue.level2.min;
    max = limitOperandValue.level2.max;
  } else if (countCorrectAnswer >= 100 && countCorrectAnswer < 150) {
    min = limitOperandValue.level3.min;
    max = limitOperandValue.level3.max;
  } else if (countCorrectAnswer >= 150 && countCorrectAnswer < 200) {
    min = limitOperandValue.level4.min;
    max = limitOperandValue.level4.max;
  } else {
    min = limitOperandValue.level5.min;
    max = limitOperandValue.level5.max;
  }

  return getRandomValue(min, max);
}

// Function for getting the result of the calculation
function getResult(firstOperand, operator, secondOperand) {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case '×':
      return firstOperand * secondOperand;
    case '÷':
      return firstOperand / secondOperand;
  }
}

// Function for setting operands and operator depending on operand values
function setOperandsAndOperator() {
  const firstOperand = setRandomOperandValue();
  const secondOperand = setRandomOperandValue();

  let arrayValues = [];
  let operatorSymbol;

  if (firstOperand > secondOperand) {
    if (
      firstOperand % secondOperand === 0 &&
      firstOperand / secondOperand !== 1 &&
      secondOperand > 1
    ) {
      operatorSymbol = '÷';
    } else if (firstOperand >= 2 && secondOperand >= 2) {
      operatorSymbol = '×';
    } else {
      operatorSymbol = '-';
    }
  } else {
    operatorSymbol = '+';
  }

  arrayValues.push(firstOperand);
  arrayValues.push(operatorSymbol);
  arrayValues.push(secondOperand);
  resultArray.push(getResult(firstOperand, operatorSymbol, secondOperand));

  return arrayValues;
}

// Function for setting random creation time of bonus drops
function setRandomTimeCreateBonusDrop(
  min = creationBonusDropInterval.min,
  max = creationBonusDropInterval.max
) {
  return getRandomValue(min, max);
}

// Function for filling a drop with operands and operator
function fillDropValues(firstOperand, operator, secondOperand) {
  const values = setOperandsAndOperator();

  let firstValue = values[0];
  let operatorSymbol = values[1];
  let secondValue = values[2];

  firstOperand.innerHTML = firstValue;
  operator.innerHTML = operatorSymbol;
  secondOperand.innerHTML = secondValue;
}

// Function for calculating and displaying game statistics
function showGameStatistics() {
  const convertMsToMin = 60000;
  const convertToPercent = 100;

  equationsPerMinute.innerHTML = Math.round(
    countCorrectAnswer / (performance.now() / convertMsToMin)
  );
  totalEquations.innerHTML = countCorrectAnswer;
  overall.innerHTML = `${Math.ceil(
    (countCorrectAnswer / countDrop) * convertToPercent
  )}%`;
  scorePoints.innerHTML = currentScore;

  gameStatistic.classList.add('visible');
  if (isSoundOn) {
    pauseSound();
    gameOverSound.play();
  }
  setBestScore();
}

// Function for animating the fall of a raindrop
function animationFallDrop(dropElement) {
  dropElement.animate(
    [
      {
        top: 0,
      },
      {
        top: `${gameField.offsetHeight}px`,
      },
    ],
    durationAnimate
  );
  dropElement.animate(
    [
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
    ],
    500
  );
}

// Function for creating a splash
function createSplash(index, elementName, splashName) {
  const thisSplashName = splashName;
  const offsetTopСorrection = 50;
  const offsetLeftСorrection = 10;
  const imageSplash = new Image(80, 80);

  let thisElementName;
  let thisItem;

  imageSplash.src = `./img/${thisSplashName}.svg`;
  imageSplash.className = `${thisSplashName}`;

  try {
    if (elementName === 'drop') {
      thisElementName = document.querySelectorAll(`.${elementName}`);
      thisItem = thisElementName[index];
      imageSplash.style.top = `${thisItem.offsetTop + offsetTopСorrection}px`;
      imageSplash.style.left = `${thisItem.offsetLeft + offsetLeftСorrection
        }px`;
      gameField.append(imageSplash);
    }
  } catch (error) { }
  try {
    if (elementName === 'bonus-drop') {
      thisElementName = document.querySelector(`.${elementName}`);
      imageSplash.style.top = `${thisElementName.offsetTop + offsetTopСorrection
        }px`;
      imageSplash.style.left = `${thisElementName.offsetLeft + offsetLeftСorrection
        }px`;
      gameField.append(imageSplash);
    }
  } catch (error) { }
}

// Function to change the score
function changeScore() {
  const countDropsOnWindow = document.querySelectorAll('.drop').length;

  let timeShowWrongAnswerText = 600;
  let addScore = currentScore + baseChangeScore + countCorrectAnswer;
  let removeScore = currentScore - baseChangeScore - countCorrectAnswer;

  if (isCorrectAnswer || isCorrectBonusAnswer) {
    if (isCorrectAnswer) {
      if (isSoundOn) {
        correctAnswerSound.currentTime = 0;
        correctAnswerSound.play();
      }
      currentScore = addScore;
    }
    if (isCorrectBonusAnswer) {
      if (isSoundOn) {
        correctBonusAnswerSound.currentTime = 0;
        correctBonusAnswerSound.play();
      }
      currentScore = addScore + countDropsOnWindow * baseChangeScore;
      bonusAnswerText.innerHTML = `+${baseChangeScore + countCorrectAnswer +
        countDropsOnWindow * baseChangeScore
        }`;
      bonusAnswerText.classList.add('show');
      setTimeout(() => {
        bonusAnswerText.classList.remove('show');
      }, timeShowWrongAnswerText);
    }
    scoreBoard.innerHTML = currentScore;
    countCorrectAnswer++;
    changeDropFallSpeed();
  } else {
    if (isSoundOn) {
      wrongAnswerSound.currentTime = 0;
      wrongAnswerSound.play();
    }
    if (removeScore > 0) {
      currentScore = removeScore;
    } else {
      currentScore = 0;
    }
    scoreBoard.innerHTML = currentScore;
    wrongAnswerText.innerHTML = -baseChangeScore - countCorrectAnswer;
    wrongAnswerText.classList.add('show');
    setTimeout(() => {
      wrongAnswerText.classList.remove('show');
    }, timeShowWrongAnswerText);
  }
}


// Function for checking the entered answer
function checkAnswer() {
  const allDrops = document.querySelectorAll('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');

  let index = resultArray.indexOf(Number(enteredAnswer));

  if (resultArray.length === 0) {
    return;
  }
  if (index !== -1) {
    if (dropsArray[index].classList.contains('bonus-drop')) {
      isCorrectBonusAnswer = true;
      changeScore();
      playSplashAnimation(index, 'bonus-drop', 'bonus-drop-splash');
      for (let i = 0; i < dropsArray.length; i++) {
        playSplashAnimation(i, 'drop', 'drop-splash');
      }
      gameField.removeChild(bonusDrop);
      allDrops.forEach((allDrops) => {
        gameField.removeChild(allDrops);
      });
      dropsArray.splice(0, dropsArray.length);
      resultArray.splice(0, resultArray.length);
    } else if (dropsArray[index].classList.contains('drop')) {
      isCorrectAnswer = true;
      changeScore();
      playSplashAnimation(index, 'drop', 'drop-splash');
      dropsArray[index].remove();
      resultArray.splice(index, 1);
      dropsArray.splice(index, 1);
    }
  } else {
    changeScore();
  }

  isCorrectBonusAnswer = false;
  isCorrectAnswer = false;
}

// Function to get a best score
function getBestScore() {
  if (localStorage.getItem('best-score') === null) {
    bestScoreBoard.textContent = 0;
  } else {
    bestScoreBoard.textContent = localStorage.getItem('best-score');
  }
}

// Function to set the best score
function setBestScore() {
  if (currentScore > Number(localStorage.getItem('best-score'))) {
    localStorage.setItem('best-score', currentScore);
  }
}

// Function to update the value on the display
function updateDisplay(number) {
  if (display.value.length < 4) {
    if (display.value == 0) {
      display.value = number;
    } else {
      display.value += number;
    }
  }
}


// Function for cleaning the display
function clearDisplay() {
  display.value = '';
}

// Function for deleting the last digit on the display
function deleteDigit() {
  display.value = display.value.slice(0, display.value.length - 1);
}

// Function for saving the value of the entered answer
function enterAnswer() {
  if (display.value !== '') {
    enteredAnswer = display.value;
    clearDisplay();
    checkAnswer();
  }
}


// Function for entering and processing operations
function enterOperation(operation) {
  switch (operation) {
    case 'clear':
      clearDisplay();
      break;
    case 'delete':
      deleteDigit();
      break;
    case 'enter':
      enterAnswer();
      break;
  }
}

// Hang the event on the keyboard wrapper and find out which button was pressed
keyboard.onclick = function (event) {
  let number = event.target.getAttribute('data-number');
  let operation = event.target.getAttribute('data-operation');

  if (number && TutorialMode === false) {
    updateDisplay(number);
  } else if (operation && TutorialMode === false) {
    enterOperation(operation);
  }
};

// Function for using the number block on the physical keyboard
function useNumpad(event) {
  if (display.value.length < 4) {
    switch (event.code) {
      case 'Numpad0':
      case 'Digit0':
        if (display.value == 0) {
          display.value = 0;
        } else {
          display.value += 0;
        }
        break;
      case 'Numpad1':
      case 'Digit1':
        if (display.value == 0) {
          display.value = 1;
        } else {
          display.value += 1;
        }
        break;
      case 'Numpad2':
      case 'Digit2':
        if (display.value == 0) {
          display.value = 2;
        } else {
          display.value += 2;
        }
        break;
      case 'Numpad3':
      case 'Digit3':
        if (display.value == 0) {
          display.value = 3;
        } else {
          display.value += 3;
        }
        break;
      case 'Numpad4':
      case 'Digit4':
        if (display.value == 0) {
          display.value = 4;
        } else {
          display.value += 4;
        }
        break;
      case 'Numpad5':
      case 'Digit5':
        if (display.value == 0) {
          display.value = 5;
        } else {
          display.value += 5;
        }
        break;
      case 'Numpad6':
      case 'Digit6':
        if (display.value == 0) {
          display.value = 6;
        } else {
          display.value += 6;
        }
        break;
      case 'Numpad7':
      case 'Digit7':
        if (display.value == 0) {
          display.value = 7;
        } else {
          display.value += 7;
        }
        break;
      case 'Numpad8':
      case 'Digit8':
        if (display.value == 0) {
          display.value = 8;
        } else {
          display.value += 8;
        }
        break;
      case 'Numpad9':
      case 'Digit9':
        if (display.value == 0) {
          display.value = 9;
        } else {
          display.value += 9;
        }
        break;
    }
  }
  switch (event.code) {
    case 'Backspace':
      clearDisplay();
      break;
    case 'NumpadDecimal':
    case 'Delete':
      deleteDigit();
      break;
    case 'NumpadEnter':
    case 'Enter':
      enterAnswer();
      break;
  }
}


// Function for checking the wave touch
function checkTouchToWave() {
  const drop = document.querySelector('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');
  const liftWaveCoefficient = 0.25; // Wave lift coefficient
  const updateFrequency = 500; // Frequency of coordinate update
  const delayShowStatistics = 500; // Delay before statistics are displayed

  let dropCoordinateY;
  let bonusDropCoordinateY;
  let waveCoordinateY = wave.offsetTop;

  try {
    dropCoordinateY = drop.offsetTop + drop.offsetHeight;
  } catch (error) { }
  try {
    bonusDropCoordinateY = bonusDrop.offsetTop + bonusDrop.offsetHeight;
  } catch (error) { }

  if (dropCoordinateY >= waveCoordinateY) {

    playSplashAnimation(0, 'drop', 'drop-splash')
    gameField.removeChild(document.querySelector('.drop'))
    resultArray.splice(0, 1);
    dropsArray.splice(0, 1);
  }
  if (bonusDropCoordinateY >= waveCoordinateY) {
    gameField.removeChild(document.querySelector('.bonus-drop'));
    resultArray.splice(0, 1);
    dropsArray.splice(0, 1);
  }

  if (
    dropCoordinateY >= waveCoordinateY ||
    bonusDropCoordinateY >= waveCoordinateY
  ) {
    countDropFallen++;

    wave.animate(
      [
        {
          height: `${wave.offsetHeight}px`,
        },
        {
          height: `${wave.offsetHeight + wave.offsetHeight * liftWaveCoefficient}px`,
        },
      ],
      200
    );
    wave2.animate(
      [
        {
          height: `${wave2.offsetHeight}px`,
        },
        {
          height: `${wave2.offsetHeight + wave2.offsetHeight * liftWaveCoefficient}px`,
        },
      ],
      500
    );

    wave.style.height = `${wave.offsetHeight + wave.offsetHeight * liftWaveCoefficient
      }px`;
    wave2.style.height = `${wave2.offsetHeight + wave2.offsetHeight * liftWaveCoefficient
      }px`;
    if (isSoundOn) {
      fallInSeaSound.currentTime = 0;
      fallInSeaSound.play();
    }
    if (countDropFallen >= healthPoints) {
      if (TutorialMode === true) {
        gameOverTutorial.classList.add('visible');
      }
      else {
        setTimeout(() => {
          showGameStatistics();
          isGameOver = true;
          document
            .querySelectorAll('.drop')
            .forEach(() =>
              gameField.removeChild(document.querySelector('.drop'))
            );
        }, delayShowStatistics);
      }
    }
  }

  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    try {
      checkTouchToWave();
    } catch (error) {
      return;
    }
  }, updateFrequency);
}

// Function for creating a drop item depending on the received name
function create(ElementName) {
  const thisName = ElementName;
  const dropElement = document.createElement('div');
  const firstOperand = document.createElement('span');
  const operator = document.createElement('span');
  const secondOperand = document.createElement('span');

  dropElement.className = `${thisName}`;
  firstOperand.className = `operand first-operand-${thisName}`;
  operator.className = 'operator';
  secondOperand.className = `operand second-operand-${thisName}`;
  dropElement.style.left = `${setRandomDropPosition()}%`;
  dropElement.append(firstOperand, operator, secondOperand);
  fillDropValues(firstOperand, operator, secondOperand);
  gameField.append(dropElement);
  dropsArray.push(dropElement);
  animationFallDrop(dropElement);
  checkTouchToWave();

  if (thisName === 'drop') {
    setTimeout(() => {
      if (isGameOver) {
        return;
      }
      create(thisName);
      countDrop++;
    }, creationDropInterval);
  }
  if (thisName === 'bonus-drop') {
    setTimeout(() => {
      if (isGameOver) {
        return;
      }
      create(thisName);
      countDrop++;
    }, setRandomTimeCreateBonusDrop());
  }
}


// Function for getting the status of the sound
function getStatusSound() {
  if (
    localStorage.getItem('is-sound-on') === null ||
    localStorage.getItem('is-sound-on') === 'undefined' ||
    localStorage.getItem('is-sound-on') === 'true'
  ) {
    isSoundOn = true;
  } else {
    isSoundOn = false;
  }
}

// Function for setting the sound status
function setStatusSound() {
  localStorage.setItem('is-sound-on', isSoundOn);
}

// Function for update the sound button style
function updateStyleSoundButton() {
  if (isSoundOn) {
    soundButton.classList.remove('sound-off');
  } else {
    soundButton.classList.add('sound-off');
  }
}


// Function to start the game
function startGame() {
  startMenu.classList.add("hide");
  gameOverTutorial.classList.add("hide");
  getBestScore(); // Getting the best score before the start
  currentScore = 0; // Set the value of the current rating to zero
  //getStatusSound();
  //setStatusSound();
  //updateStyleSoundButton();
  if (isSoundOn) {
    playSound(); // Turning on the sound
  }
  create('drop'); // Starting the creation of raindrops
  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    create('bonus-drop'); // Starting the creation of bonus raindrops
  }, setRandomTimeCreateBonusDrop());
}

// Function to start playing sounds
function playSound() {
  rainSound.play();
  seaSound.play();
}

// Function for stopping the playback of sounds
function pauseSound() {
  rainSound.pause();
  seaSound.pause();
}

// Hang an event handler on the sound button
soundButton.addEventListener('click', () => {
  isSoundOn = !isSoundOn;
  setStatusSound();

  if (isSoundOn) {
    playSound();
    soundButton.classList.toggle('sound-off');
  } else {
    pauseSound();
    soundButton.classList.toggle('sound-off');
  }
});

// Enable fullscreen mode by pressing the corresponding button
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    gameContainer.requestFullscreen();
  }
});

// Listening to the press of the physical keyboard
window.addEventListener('keydown', useNumpad);

//startGame(); // Running the game


//Tutorial part
function createDropTutorial(elementName, position, value1, symbolOperand, value2) {
  const thisName = elementName;
  const dropElement = document.createElement('div');
  const firstOperand = document.createElement('span');
  const operator = document.createElement('span');
  const secondOperand = document.createElement('span');

  dropElement.className = `${thisName}`;
  firstOperand.className = `operand first-operand-${thisName}`;
  operator.className = 'operator';
  secondOperand.className = `operand second-operand-${thisName}`;
  dropElement.style.left = `${position}%`;
  dropElement.append(firstOperand, operator, secondOperand);
  firstOperand.innerHTML = value1;
  operator.innerHTML = symbolOperand;
  secondOperand.innerHTML = value2;
  resultArray.push(getResult(value1, symbolOperand, value2));
  gameField.append(dropElement);
  dropsArray.push(dropElement);
  animationFallDrop(dropElement);
  checkTouchToWave();
}

function downWave() {
  const liftWaveCoefficient = 0.25;
  const lowWaveCoefficient = 1.9;
  wave.style.height = `${wave.offsetHeight - wave.offsetHeight *
    liftWaveCoefficient * lowWaveCoefficient
    }px`;
  wave2.style.height = `${wave2.offsetHeight - wave2.offsetHeight *
    liftWaveCoefficient * lowWaveCoefficient
    }px`;
}

function playSceneOne() {
  return new Promise((resolve) => {
    durationAnimate = 15000;
    createDropTutorial('drop', 40, 2, '+', 2);

    setTimeout(() => {
      document.getElementById('4').classList.add('active');
      display.value = 4;
      enteredAnswer = display.value;
    }, 2500);
    setTimeout(() => {
      document.getElementById('4').classList.remove('active');
    }, 2700);
    setTimeout(() => {
      document.getElementById('enter').classList.add('active');
      checkAnswer();
      display.value = '';
    }, 3700);
    setTimeout(() => {
      document.getElementById('enter').classList.remove('active');
    }, 3900);
    setTimeout(() => {
      resolve();
    }, 4900);
  });
}

function playSceneTwo() {
  return new Promise((resolve) => {
    durationAnimate = 20000;
    createDropTutorial('drop', 5, 14, '-', 7);

    setTimeout(() => {
      createDropTutorial('drop', 45, 4, '+', 8);
    }, 1500);
    setTimeout(() => {
      createDropTutorial('drop', 25, 28, '÷', 7);
    }, 3000);
    setTimeout(() => {
      createDropTutorial('drop', 78, 5, '×', 5);
    }, 4500);
    setTimeout(() => {
      createDropTutorial('bonus-drop', 60, 81, '÷', 9);
    }, 6000);
    setTimeout(() => {
      document.getElementById('9').classList.add('active');
      display.value = 9;
      enteredAnswer = display.value;
    }, 8000);
    setTimeout(() => {
      document.getElementById('9').classList.remove('active');
    }, 8200);
    setTimeout(() => {
      document.getElementById('enter').classList.add('active');
      checkAnswer();
      display.value = '';
    }, 10200);
    setTimeout(() => {
      document.getElementById('enter').classList.remove('active');
    }, 10400);
    setTimeout(() => {
      resolve();
    }, 11400);
  });
}

function playSceneThree() {
  return new Promise((resolve) => {
    durationAnimate = 8000;
    createDropTutorial('drop', 10, 7, '-', 5);

    setTimeout(() => {
      createDropTutorial('drop', 40, 9, '÷', 3);
    }, 1500);
    setTimeout(() => {
      createDropTutorial('drop', 70, 4, '×', 2);
    }, 3000);
    setTimeout(() => {
      resolve();
    }, 10000);
  });
}

function playTutorial() {
  startMenu.classList.add("hide");
  // for (let i = 0; i < btnWrapper.length; i++) {
  //   btnWrapper[i].removeAttribute('data-number');
  // }
  TutorialMode = true;
  playSceneOne()
    .then(() => playSceneTwo())
    .then(() => playSceneThree())
    .then(() => {
      isGameOver = false;
      countDropFallen = 0;
      currentScore = 0;
      scoreBoard.innerHTML = '0';
      TutorialMode = false;
      downWave();
      // hideGameOverBoard();
      // playTutorial();
    });
}