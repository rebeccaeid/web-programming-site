let total = 0; // how many questions (from the server)
const cache = {}; // cache[i] = a fetched question object
let currentQuestion = 0;
const userAnswers = []; // the length isn't known until you fetch the count

async function getQuestion(index) {
    if (cache[index]) {
        return cache[index];
    }
    const response = await fetch(`/api/question/${index}`);
    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }
    const data = await response.json();
    cache[index] = data;
    return data;
}


function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
}


function goNext() {
  if (currentQuestion < total - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  currentQuestion = 0;
  renderQuestion();
}

function goLast() {
  currentQuestion = total - 1;
  renderQuestion();
}


async function calculateScore() {
  let score = 0;
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    if (userAnswers[i] !== undefined && userAnswers[i] === q.answer) {
      score++;
    }
  }
  return score;
}


function calculatePercentage(score) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}


function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}


async function buildCorrection() {
  let correction = "";

  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    const userChoiceIndex = userAnswers[i];
    
    const userAnswerText = (userChoiceIndex !== undefined) ? q.choices[userChoiceIndex] : "Not answered";
    const correctAnswerText = q.choices[q.answer];
    
    const isCorrect = (userChoiceIndex !== undefined && userChoiceIndex === q.answer);
    const resultText = isCorrect ? "Correct" : "Incorrect";

    correction += `Question ${i + 1}: ${q.question}\n`;
    correction += `Your answer: ${userAnswerText}\n`;
    correction += `Correct answer: ${correctAnswerText}\n`;
    correction += `Result: ${resultText}\n`;
    correction += `Explanation: ${q.explanation}\n\n`;
  }

  return correction;
}


async function submitQuiz() {
  const loading = document.getElementById("loading");  
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  try{  
   const score = await calculateScore();
   const percentage = calculatePercentage(score);
   const message = getPerformanceMessage(percentage);
   const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
  }
  catch (err) {
    loading.hidden = true;
    error.hidden = false;
    error.textContent = "Error calculating results: " + err.message;
  }
}

async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  try{
    const q = await getQuestion(currentQuestion);
        document.getElementById("progress").textContent =
        `Question ${currentQuestion + 1} of ${total}`;

    
    document.getElementById("questionText").textContent = q.question;

    
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";
    for (let i = 0; i < q.choices.length; i++) {
        const label = document.createElement("label");
        label.className = "choice";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.value = i;
        
        if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
        }
    
        radio.onclick = function () {
        saveAnswer(i);
        };
        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + q.choices[i]));
        choicesContainer.appendChild(label);
    }


    document.getElementById("firstBtn").disabled = currentQuestion === 0;
    document.getElementById("previousBtn").disabled = currentQuestion === 0;
    document.getElementById("nextBtn").disabled =
        currentQuestion === total - 1;
    document.getElementById("lastBtn").disabled =
        currentQuestion === total - 1;
    }
   catch (err) {
    error.hidden = false;
    error.textContent = "Error loading question: " + err.message;
   }
   finally {
    loading.hidden = true;
   } }

function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

async function init() {
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    loading.hidden = false;
    try{
    const response = await fetch("/api/questions/count");
      if (!response.ok) {
         throw new Error("HTTP " + response.status);
}
const data = await response.json();
total = data.count;
await renderQuestion();
}
    catch (err) {
        loading.hidden = true;
        error.hidden = false;
        error.textContent = "Error loading quiz: " + err.message;
    } 
}
init();