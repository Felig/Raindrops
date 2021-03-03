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
let durationAnimate = 5000; // Animation duration
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

  imageSplash.src = `../assets/images/svg/${thisSplashName}.svg`;
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
      setTimeout(() => {
        // showGameStatistics();
        isGameOver = true;
        document
          .querySelectorAll('.drop')
          .forEach(() =>
            gameField.removeChild(document.querySelector('.drop'))
          );
      }, delayShowStatistics);
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



// Function to start the game
function startGame() {

  currentScore = 0; // Set the value of the current rating to zero

  create('drop'); // Starting the creation of raindrops
  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    create('bonus-drop'); // Starting the creation of bonus raindrops
  }, setRandomTimeCreateBonusDrop());
}


// Enable fullscreen mode by pressing the corresponding button
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    gameContainer.requestFullscreen();
  }
});



startGame(); // Running the game
