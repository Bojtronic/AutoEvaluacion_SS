let userAnswers = [];

const questionsContainer = document.getElementById("questionsContainer");
const topicTitle = document.getElementById("topicTitle");
const nextBtn = document.getElementById("nextBtn");

const QUESTIONS_PER_GROUP = 3;

let questions = [];
let groupedQuestions = [];
let currentGroupIndex = 0;
let attemptId = null;

// ==========================================
// INICIAR EXAMEN REAL
// ==========================================
async function startExam() {

    const user_id = localStorage.getItem("user_id");
    const exam_id = localStorage.getItem("exam_id");

    const response = await fetch("/api/start-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, exam_id })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        window.location.href = "/";
        return;
    }

    attemptId = data.attempt_id;
    questions = data.questions;

    groupQuestionsByTopic();
    showCurrentGroup();
}

// ==========================================
// AGRUPAR POR TEMA
// ==========================================
function groupQuestionsByTopic() {
    const topics = {};

    questions.forEach(q => {
        if (!topics[q.topic]) {
            topics[q.topic] = [];
        }
        topics[q.topic].push(q);
    });

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

// ==========================================
// MOSTRAR GRUPO
// ==========================================
function showCurrentGroup() {

    const group = groupedQuestions[currentGroupIndex];

    topicTitle.textContent = group.topic;
    questionsContainer.innerHTML = "";

    group.questions.forEach((q, index) => {

        const card = document.createElement("div");
        card.className = "question-card";

        card.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3>
            <div class="options">
                ${q.options.map(opt => `
                    <label class="option">
                        <input 
                            type="radio" 
                            name="question-${q.id}" 
                            value="${opt.id}">
                        ${opt.text}
                    </label>
                `).join("")}
            </div>
        `;

        questionsContainer.appendChild(card);

        const inputs = card.querySelectorAll("input[type='radio']");

        inputs.forEach(input => {
            input.addEventListener("change", () => {

                userAnswers = userAnswers.filter(
                    ans => ans.question_id !== q.id
                );

                userAnswers.push({
                    question_id: q.id,
                    selected_option_id: parseInt(input.value)
                });
            });
        });
    });

    nextBtn.textContent =
        currentGroupIndex === groupedQuestions.length - 1
        ? "Finalizar"
        : "Siguiente";
}

// ==========================================
// FINALIZAR EXAMEN
// ==========================================
async function finishExam() {

    const response = await fetch("/api/finish-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            attempt_id: attemptId,
            answers: userAnswers
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    // Mostrar resultado simple
    alert(`Examen finalizado\nNota: ${data.score}\nCorrectas: ${data.correct}\nIncorrectas: ${data.incorrect}`);

    window.location.href = "/";
}

// ==========================================
// BOTÓN SIGUIENTE
// ==========================================
nextBtn.addEventListener("click", () => {

    const group = groupedQuestions[currentGroupIndex];

    const unanswered = group.questions.some(q =>
        !userAnswers.find(ans => ans.question_id === q.id)
    );

    if (unanswered) {
        alert("Debes responder todas las preguntas antes de continuar.");
        return;
    }

    if (currentGroupIndex < groupedQuestions.length - 1) {
        currentGroupIndex++;
        showCurrentGroup();
    } else {
        finishExam();
    }
});

// Iniciar examen real
startExam();
