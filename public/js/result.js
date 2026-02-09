// Obtener resultados del localStorage
const evaluationData = JSON.parse(
    localStorage.getItem("quizResults")
) || [];

// Elementos del DOM
const resultsContainer = document.getElementById("resultsContainer");
const finalScoreEl = document.getElementById("finalScore");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

// Validación básica
if (evaluationData.length === 0) {
    finalScoreEl.textContent = "No hay resultados para mostrar.";
    downloadPdfBtn.disabled = true;
}

// Calcular puntaje
function calculateScore() {
    const total = evaluationData.length;
    const correct = evaluationData.filter(q => q.isCorrect).length;
    const grade = total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    return {
        total,
        correct,
        grade
    };
}

// Mostrar resultados en pantalla
function renderResults() {
    const score = calculateScore();

    finalScoreEl.innerHTML = `
        Resultado: ${score.correct} / ${score.total}
        <br>
        <strong>Nota final: ${score.grade}%</strong>
    `;

    resultsContainer.innerHTML = "";

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

    const score = calculateScore();
    let y = 15;

    doc.setFontSize(14);
    doc.text("Security Software - Resultados de Evaluación", 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(`Resultado final: ${score.correct} / ${score.total}`, 10, y);

    y += 8;
    doc.text(`Nota final: ${score.grade}%`, 10, y);

    y += 12;

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

    // Descargar PDF
    doc.save("resultado_evaluacion_security_software.pdf");

    // Redirigir al inicio después de descargar
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 500);
}


// Eventos
downloadPdfBtn.addEventListener("click", generatePDF);

// Inicializar
renderResults();
