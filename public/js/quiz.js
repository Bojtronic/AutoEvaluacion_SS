let userAnswers = [];

const questionsContainer = document.getElementById("questionsContainer");
const topicTitle = document.getElementById("topicTitle");
const nextBtn = document.getElementById("nextBtn");

// CONFIGURACIÓN
const QUESTIONS_PER_GROUP = 3;

// Estado
let questions = [];
let groupedQuestions = [];
let currentGroupIndex = 0;



// Obtener preguntas desde backend
async function loadQuestions() {
    const response = await fetch("/api/questions");
    questions = await response.json();

    groupQuestionsByTopic();
    showCurrentGroup();
}

// Agrupar preguntas por tema
function groupQuestionsByTopic() {
    const topics = {};

    questions.forEach(q => {
        if (!topics[q.topic]) {
            topics[q.topic] = [];
        }
        topics[q.topic].push(q);
    });

    // Convertir a grupos de N preguntas
    groupedQuestions = [];

    Object.keys(topics).forEach(topic => {
        for (let i = 0; i < topics[topic].length; i += QUESTIONS_PER_GROUP) {
            groupedQuestions.push({
                topic,
                questions: topics[topic].slice(i, i + QUESTIONS_PER_GROUP)
            });
        }
    });
}

// Mostrar grupo actual
function showCurrentGroup() {
    const group = groupedQuestions[currentGroupIndex];

    topicTitle.textContent = group.topic;
    questionsContainer.innerHTML = "";

    group.questions.forEach((q, index) => {
        const card = document.createElement("div");
        card.className = "question-card";

        const randomOptions = getRandomOptions(q, 5);

        card.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3>
            <div class="options">
                ${randomOptions.map((opt, i) => `
                    <label class="option">
                        <input 
                            type="radio" 
                            name="question-${q.id}" 
                            value="${i}" 
                            data-correct="${opt.isCorrect}">
                        ${opt.text}
                    </label>
                `).join("")}
            </div>
        `;

        questionsContainer.appendChild(card);

        const inputs = card.querySelectorAll("input[type='radio']");

        inputs.forEach(input => {
            input.addEventListener("change", () => {

                // Eliminar respuesta previa de esta pregunta
                userAnswers = userAnswers.filter(
                    ans => ans.questionId !== q.id
                );

                userAnswers.push({
                    questionId: q.id,
                    question: q.question,
                    topic: q.topic,
                    selectedOption: input.parentElement.textContent.trim(),
                    isCorrect: input.dataset.correct === "true",
                    correctOption: q.options[q.correctIndex]
                });
            });
        });

    });

    if (currentGroupIndex === groupedQuestions.length - 1) {
        nextBtn.textContent = "Finalizar";
    } else {
        nextBtn.textContent = "Siguiente";
    }
}


function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getRandomOptions(question, totalOptions = 5) {
    const correctOption = {
        text: question.options[question.correctIndex],
        isCorrect: true
    };

    const incorrectOptions = question.options
        .map((opt, index) => ({ text: opt, index }))
        .filter(opt => opt.index !== question.correctIndex);

    shuffleArray(incorrectOptions);

    const selectedIncorrect = incorrectOptions
        .slice(0, totalOptions - 1)
        .map(opt => ({ text: opt.text, isCorrect: false }));

    const finalOptions = [correctOption, ...selectedIncorrect];

    return shuffleArray(finalOptions);
}


// Botón siguiente
nextBtn.addEventListener("click", () => {

    const group = groupedQuestions[currentGroupIndex];

    const unanswered = group.questions.some(q =>
        !userAnswers.find(ans => ans.questionId === q.id)
    );

    if (unanswered) {
        alert("Debes responder todas las preguntas antes de continuar.");
        return;
    }

    if (currentGroupIndex < groupedQuestions.length - 1) {
        currentGroupIndex++;
        showCurrentGroup();
    } else {
        // Guardar respuestas
        localStorage.setItem(
            "quizResults",
            JSON.stringify(userAnswers)
        );

        window.location.href = "/html/result.html";
    }
});


// Inicializar
loadQuestions();
