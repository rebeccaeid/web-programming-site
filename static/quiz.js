const questions = [
  {
    question: "At what age did Ziad Rahbani compose his first iconic song 'Saalouni El Nas' for Fairuz?",
    choices: ["14", "17", "21", "25"],
    answer: 1,
    explanation: "Ziad composed 'Saalouni El Nas' in 1973 when he was just 17 years old while his father, Assi Rahbani, was hospitalized."
  },
  {
    question: "Which iconic 1974 play marked Ziad Rahbani's debut as a full theatrical writer and director?",
    choices: ["Sahriye", "Nazl El Sourour", "Bennesbeh Laboukra...", "Film Kteer Kbeer"],
    answer: 1,
    explanation: "'Nazl El Sourour' was his first landmark full length play, premiered in 1974."
  },
  {
    question: "Which musical genre is Ziad Rahbani most famous for pioneering in the Arab world?",
    choices: ["Oriental Jazz Fusion", "Traditional Andalusian Tarab", "Heavy Metal", "Symphonic Classical"],
    answer: 0,
    explanation: "Ziad Rahbani pioneered Oriental Jazz by blending traditional Arabic maqamat with Western jazz, funk, and bossa nova."
  },
  {
    question: "Which iconic singer and close collaborator performed key roles and songs in many of Ziad's plays?",
    choices: ["Wadih El Safi", "Joseph Sakr", "Melhem Barakat", "Nasri Shamseddine"],
    answer: 1,
    explanation: "Joseph Sakr was Ziad's key vocal collaborator, performing famous tracks like 'Bala Wala Shi' and starring in his major plays."
  },
  {
    question: "What is the title of Ziad Rahbani's famous 1978 jazz-funk instrumental album that included 'Prelude to Mais El Rim'?",
    choices: ["Kifak Inta", "Abu Ali", "Houdou' Nisbi", "Monodose"],
    answer: 1,
    explanation: "'Abu Ali' (1978) is a highly sought-after Oriental funk/jazz record produced by Ziad in Athens."
  },
  {
    question: "Which 1978 play by Ziad Rahbani is set in a local Beirut bar during the Lebanese Civil War?",
    choices: ["Bennesbeh Laboukra... Shu Fi Mafi?", "Shi Feshel", "Loulou", "Mais El Rim"],
    answer: 0,
    explanation: "'Bennesbeh Laboukra... Shu Fi Mafi?' premiered in 1978 and is widely regarded as one of his greatest theatrical works."
  },
  {
    question: "Which classic song written and composed by Ziad Rahbani was performed by Fairuz on her 1991 album?",
    choices: ["Kifak Inta", "Habaitak Bel Saif", "Li Beirut", "Nassam Alayna El Hawa"],
    answer: 0,
    explanation: "'Kifak Inta' was released in 1991 and featured Ziad's signature modern Arabic pop and jazz composition style."
  },
  {
    question: "What was the title of Ziad Rahbani's satirical 1983 play that mocked the political situation and theatre production in Lebanon?",
    choices: ["Sahriye", "Shi Feshel", "Anteka", "Film Ameriki Tawil"],
    answer: 1,
    explanation: "'Shi Feshel' was a satirical play that parodied the romanticized theatre tradition during wartime."
  },
  {
    question: "Which character did Ziad Rahbani himself play in 'Bennesbeh Laboukra... Shu Fi Mafi?'",
    choices: ["Zakaria", "Razaq", "Mounir", "Najib"],
    answer: 0,
    explanation: "Ziad played Zakaria, the pragmatic bartender working at the bar where the play takes place."
  },
  {
    question: "Which 2015 Lebanese hit dark comedy film features an original music score composed by Ziad Rahbani?",
    choices: ["Very Big Shot (Film Kteer Kbeer)", "West Beirut", "Caramel", "Capernaum"],
    answer: 0,
    explanation: "Ziad Rahbani composed the original soundtrack for Mir-Jean Bou Chaaya's acclaimed 2015 film 'Very Big Shot' (Film Kteer Kbeer)."
  }
];


let currentQuestion = 0;
const userAnswers = new Array(questions.length);


function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
}


function goNext() {
  if (currentQuestion < questions.length - 1) {
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
  currentQuestion = questions.length - 1;
  renderQuestion();
}


function calculateScore() {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] !== undefined && userAnswers[i] === questions[i].answer) {
      score++;
    }
  }
  return score;
}


function calculatePercentage(score) {
  if (questions.length === 0) return 0;
  return Math.round((score / questions.length) * 100);
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


function buildCorrection() {
  let correction = "";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
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


function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];


  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

 
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
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}


renderQuestion();