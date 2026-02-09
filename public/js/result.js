const resultsContainer = document.getElementById("resultsContainer");
const finalScoreEl = document.getElementById("finalScore");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

// Datos simulados (luego vienen del quiz)
const evaluationData = JSON.parse(localStorage.getItem("quizResults")) || [];

// Calcular puntaje
function calculateScore() {
    const correct = evaluationData.filter(q => q.isCorrect).length;
    return {
        correct,
        total: evaluationData.length
    };
}

// Mostrar resultados en pantalla
function renderResults() {
    const score = calculateScore();
    finalScoreEl.textContent = `Resultado: ${score.correct} / ${score.total}`;

    evaluationData.forEach((q, index) => {
        const card = document.createElement("div");
        card.className = `result-card ${q.isCorrect ? "correct" : "incorrect"}`;

        card.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3>
            <p><strong>Tu respuesta:</strong> ${q.selectedOption}</p>
            <p><strong>Respuesta correcta:</strong> ${q.correctOption}</p>
            <p><strong>Resultado:</strong> ${q.isCorrect ? "Correcta" : "Incorrecta"}</p>
        `;

        resultsContainer.appendChild(card);
    });
}

// Generar PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 15;
    doc.setFontSize(14);
    doc.text("Security Software - Resultados de Evaluación", 10, y);

    y += 10;
    const score = calculateScore();
    doc.setFontSize(12);
    doc.text(`Resultado final: ${score.correct} / ${score.total}`, 10, y);

    y += 10;

    evaluationData.forEach((q, index) => {
        if (y > 270) {
            doc.addPage();
            y = 15;
        }

        doc.setFontSize(11);
        doc.text(`${index + 1}. ${q.question}`, 10, y);
        y += 6;

        doc.text(`Tu respuesta: ${q.selectedOption}`, 10, y);
        y += 6;

        doc.text(`Respuesta correcta: ${q.correctOption}`, 10, y);
        y += 6;

        doc.text(`Resultado: ${q.isCorrect ? "Correcta" : "Incorrecta"}`, 10, y);
        y += 10;
    });

    doc.save("resultado_evaluacion_security_software.pdf");
}

// Eventos
downloadPdfBtn.addEventListener("click", generatePDF);

// Inicializar
renderResults();
