// HTML DOM Get modifiers
let startBtn = document.getElementById('start');
let scoreboardBtn = document.getElementById('viewHigh')
let nextBtn = document.getElementById('next');
let resetBtn = document.getElementById('reset')
let selectTrue = document.getElementById('answer-true');
let selectFalse = document.getElementById('answer-false');
let questionEl = document.getElementById('question');
let progressBar = document.getElementById('progressBar');
let countdown = document.getElementById('countdown');
let resetScore = document.getElementById('resetScore')
let scoreList = document.getElementById('scoreList')
let input = document.getElementsByTagName('input');
let labels = document.getElementsByTagName('label');
let createLi = document.createElement('li')

// HTML DOM Set attributes
progressBar.setAttribute('value', '0', 'max', '60');
input[0].setAttribute('type', 'radio', 'name', 'True', 'value', 'true');
input[1].setAttribute('type', 'radio', 'name', 'False', 'value', 'false');

// Event Listeners
startBtn.addEventListener('click', startQuiz)
nextBtn.addEventListener('click', nextQuestion)
scoreboardBtn.addEventListener('click', displayScoreboard)
resetBtn.addEventListener('click', resetPage)

selectTrue.addEventListener('click', buttonTrueCheck)
selectFalse.addEventListener('click', buttonFalseCheck)

// Global Variables
let remainingSeconds = 60; // The initial amount of seconds when starting the quiz
let questionIndex = 0; // Question array index
let answers = [] // An empty array to enter in the answer choices
let scoreboard = [] // An empty array to enter in the score values
let vis = 0;  // This sets the visibility to zero by default to only show the start and scoreboard button
let downloadTimer // This is a variable for the timer

// This function initiates the timer and the question display while switching the start button to a next button
function startQuiz() {
  visibility(vis)
  startTimer();
  showQuestion(questionBank[questionIndex])
}

// This function cycles through the questions
function nextQuestion() {
  if (questionIndex >= questionBank.length - 1) {
    vis++;
    visibility(vis)
    answers.push(checkValue())
    clearInterval(downloadTimer);
    calcScore(answers)
  }
  else {
    answers.push(checkValue())
    penalty()
    resetQuestionState()
    questionIndex += 1
    showQuestion(questionBank[questionIndex])
  }
}

function showQuestion(question) {
  questionEl.innerText = question.prompt
}

// check state of radio box and sets true and false value
function checkValue() {
  let selectedAnswer;
  if (selectTrue.checked) {
    selectedAnswer = 'true';
  }
  if (selectFalse.checked) {
    selectedAnswer = 'false';
  }
  return selectedAnswer;
}

// This takes time off of the timer when the user chooses the wrong answer
function penalty() {
  let i = questionIndex

  if (answers.slice(-1) != questionBank[i].answer) {
    remainingSeconds -= 10;
  }
  return;
}

// This function calculates the total score by comparing the users answers with the answers in the question bank
function calcScore(score) {
  let grade = 0;
  let trueAnswers = 0

  for (let i = 0; i < score.length; i++) {
    if (score[i] == questionBank[i].answer) {
      trueAnswers++
    }
    grade = ((trueAnswers / score.length) * 10000)
  }
  highScore(grade);
}

// Retrieve high scores from local storage
function getHighScore() {
  var highList = localStorage.getItem('highScoreList')
  if (highList === null) {
    highList = []
  } else {
    highList = JSON.parse(highList)
  }
  return highList
}

//Prompt user for name and pass final score to place into local storage
function highScore(score) {
  visibility(3);
  var initials = prompt("Enter your initials")
  var highList = getHighScore()

  highList.push({
    user: initials,
    highScore: score,
  });

  highList = highList.sort((a, b) => (a.highScore < b.highScore ? 1 : -1))
  if (highList.length > 3) {
    highList.pop();
  }

  var stringInfo = JSON.stringify(highList);

  localStorage.setItem('highScoreList', stringInfo)
}

// Appends the high scores list item into the HTML from local storage
function displayScoreboard() {
  var pulledItem = getHighScore()
  for (let i = 0; i < pulledItem.length; i++) {
    var createLi = document.createElement('li');
    createLi.innerHTML = pulledItem[i].user + " - " + pulledItem[i].highScore
    scoreList.appendChild(createLi)
  }
}

// cleanup HTML back to baseline
function resetQuestionState() {
  selectTrue.checked = false;
  selectFalse.checked = false;
}

// This function prevents both true and false from being chosen
function buttonTrueCheck() {
  if (selectTrue.checked) {
    selectFalse.checked = false;
  }
}

function buttonFalseCheck() {
  if (selectFalse.checked) {
    selectTrue.checked = false;
  }
}

// This function reloads the web page
function resetPage() {
  location.reload();
}

// Global visibility settings
// Start of quiz
function visibility(value) {
  if (value === 0) {
    startBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    labels[0].classList.remove('hidden');
    labels[1].classList.remove('hidden');
    input[0].classList.remove('hidden');
    input[1].classList.remove('hidden');
    progressBar.classList.remove('hidden');
    countdown.classList.remove('hidden');
  }

  // All Questions complete
  if (value === 1) {
    nextBtn.classList.add('hidden')
    labels[0].classList.add('hidden')
    labels[1].classList.add('hidden')
    input[0].classList.add('hidden')
    input[1].classList.add('hidden')
    progressBar.classList.add('hidden')
    countdown.classList.add('hidden')
    scoreboardBtn.classList.remove("hidden")
  }

  // When the quiz is completed, the reset quiz button appears
  if (value === 2) {
    resetBtn.classList.remove('hidden')
    questionEl.classList.add('hidden')
  }

  // When the quiz is not finished in the time limit, the reset button displays so the user can restart
  if (value === 3) {
    nextBtn.classList.add('hidden')
    labels[0].classList.add('hidden')
    labels[1].classList.add('hidden')
    input[0].classList.add('hidden')
    input[1].classList.add('hidden')
    progressBar.classList.add('hidden')
    countdown.classList.add('hidden')
    scoreboardBtn.classList.remove("hidden")
    resetBtn.classList.remove('hidden')
    questionEl.classList.add('hidden')
  }
}

// The questionBank is an array that contains objects of the questions and answers
let questionBank = [
  {
    prompt: 'HTML stands for "Hey Thats My Lunch!"',
    answer: 'false',
  },
  {
    prompt: 'Integer is a data type in JavaScript',
    answer: 'false',
  },
  {
    prompt: 'The operator === means strictly equal',
    answer: 'true',
  },
  {
    prompt: 'CSS stands for Counter-Strike Source',
    answer: 'false',
  },
  {
    prompt: 'Booleans are either true or false',
    answer: 'true',
  },
]

// This function will start the timer countdown
function startTimer() {
  downloadTimer = setInterval(function () {
    if (remainingSeconds <= 0) {
      clearInterval(downloadTimer);
      document.getElementById('countdown').innerHTML = 'Times Up';
      if (answers.length < questionBank) {
        answers.push(checkValue());
      }
      calcScore(answers);
    }
    else {
      document.getElementById('countdown').innerHTML = remainingSeconds + ' seconds remaining';
      progressBar.value = remainingSeconds;
    }
    remainingSeconds -= 1;
  }, 1000);
}