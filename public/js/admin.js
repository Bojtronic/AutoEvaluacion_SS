// ================== PROTECCIÓN ==================
const role = localStorage.getItem("role");

if (!role || role !== "admin") {
    localStorage.clear();
    window.location.href = "login.html";
}

// ================== BASE API ==================
const API = "/api";

// ================== HELPER FETCH ==================
async function apiFetch(url, options = {}) {
    const res = await fetch(url, options);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en servidor");
    }

    return res.json();
}

// ================== MODAL ==================
const modal = document.getElementById("modal");
const overlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalSaveBtn = document.getElementById("modalSaveBtn");

function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Limpia evento anterior
    modalSaveBtn.onclick = null;
}

function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}

document.getElementById("closeModalBtn").onclick = closeModal;
document.getElementById("modalCancelBtn").onclick = closeModal;
overlay.onclick = closeModal;

// ================== DASHBOARD ==================
async function loadDashboard() {
    try {
        const [topics, questions, users] = await Promise.all([
            apiFetch(`${API}/topics`),
            apiFetch(`${API}/questions`),
            apiFetch(`${API}/users`)
        ]);

        document.getElementById("totalTopics").textContent = topics.length;
        document.getElementById("totalQuestions").textContent = questions.length;
        document.getElementById("totalUsers").textContent = users.length;

    } catch (error) {
        console.error("Error cargando dashboard:", error);
    }
}

// ================== TEMAS ==================
async function loadTopics() {
    try {
        const topics = await apiFetch(`${API}/topics`);
        const table = document.getElementById("topicsTable");
        table.innerHTML = "";

        topics.forEach(topic => {
            table.innerHTML += `
                <tr>
                    <td>${topic.name}</td>
                    <td>${topic.description || ""}</td>
                    <td>${topic.active ? "Activo" : "Inactivo"}</td>
                    <td>
                        <button onclick="editTopic(${topic.id})">Editar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando temas:", error);
    }
}

// Nuevo Tema
document.getElementById("addTopicBtn")
    ?.addEventListener("click", () => {

        openModal("Nuevo Tema", `
            <label>Nombre</label>
            <input type="text" id="topicName">

            <label>Descripción</label>
            <textarea id="topicDescription"></textarea>
        `);

        modalSaveBtn.onclick = async () => {
            const name = document.getElementById("topicName").value.trim();
            const description = document.getElementById("topicDescription").value.trim();

            if (!name) {
                alert("El nombre es obligatorio");
                return;
            }

            try {
                await apiFetch(`${API}/topics`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description })
                });

                closeModal();
                loadTopics();
                loadDashboard();
            } catch (error) {
                alert("Error guardando tema");
                console.error(error);
            }
        };
    });

// ================== PREGUNTAS ==================
async function loadQuestions() {
    try {
        const questions = await apiFetch(`${API}/questions`);
        const table = document.getElementById("questionsTable");
        table.innerHTML = "";

        questions.forEach(q => {
            table.innerHTML += `
                <tr>
                    <td>${q.question_text}</td>
                    <td>${q.topic_name}</td>
                    <td>
                        <button onclick="editQuestion(${q.id})">Editar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando preguntas:", error);
    }
}

// Nueva Pregunta
document.getElementById("addQuestionBtn")
    ?.addEventListener("click", async () => {

        try {
            const topics = await apiFetch(`${API}/topics`);

            const topicOptions = topics
                .map(t => `<option value="${t.id}">${t.name}</option>`)
                .join("");

            openModal("Nueva Pregunta", `
                <label>Tema</label>
                <select id="questionTopic">${topicOptions}</select>

                <label>Enunciado</label>
                <textarea id="questionText"></textarea>

                <label>Opciones</label>
                <input type="text" class="optionInput" placeholder="Opción 1">
                <input type="text" class="optionInput" placeholder="Opción 2">
                <input type="text" class="optionInput" placeholder="Opción 3">
                <input type="text" class="optionInput" placeholder="Opción 4">

                <label>Respuesta Correcta</label>
                <select id="correctOption">
                    <option value="0">Opción 1</option>
                    <option value="1">Opción 2</option>
                    <option value="2">Opción 3</option>
                    <option value="3">Opción 4</option>
                </select>
            `);

            modalSaveBtn.onclick = async () => {
                const topic_id = document.getElementById("questionTopic").value;
                const question_text = document.getElementById("questionText").value.trim();
                const options = document.querySelectorAll(".optionInput");
                const correctIndex = document.getElementById("correctOption").value;

                if (!question_text) {
                    alert("Debe ingresar la pregunta");
                    return;
                }

                const optionList = Array.from(options).map((input, index) => ({
                    option_text: input.value.trim(),
                    is_correct: index == correctIndex
                }));

                if (optionList.some(o => !o.option_text)) {
                    alert("Todas las opciones deben estar completas");
                    return;
                }

                await apiFetch(`${API}/questions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        topic_id,
                        question_text,
                        options: optionList
                    })
                });

                closeModal();
                loadQuestions();
                loadDashboard();
            };

        } catch (error) {
            console.error("Error creando pregunta:", error);
        }
    });

// ================== USUARIOS ==================
async function loadUsers() {
    try {
        const users = await apiFetch(`${API}/users`);
        const table = document.getElementById("usersTable");
        table.innerHTML = "";

        users.forEach(u => {
            table.innerHTML += `
                <tr>
                    <td>${u.username}</td>
                    <td>${u.max_attempts || 0}</td>
                    <td>${u.active ? "Activo" : "Inactivo"}</td>
                    <td>
                        <button onclick="editUser(${u.id})">Editar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

// ================== RESULTADOS ==================
async function loadResults() {
    try {
        const results = await apiFetch(`${API}/results`);
        const table = document.getElementById("resultsTable");
        table.innerHTML = "";

        results.forEach(r => {
            table.innerHTML += `
                <tr>
                    <td>${r.username}</td>
                    <td>${r.exam_name}</td>
                    <td>${r.score}</td>
                    <td>${new Date(r.finished_at).toLocaleString()}</td>
                    <td><button onclick="viewResult(${r.id})">Ver</button></td>
                    <td><button onclick="downloadPDF(${r.id})">PDF</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando resultados:", error);
    }
}

// ================== FUNCIONES PLACEHOLDER ==================
function editTopic(id) {
    console.log("Editar tema:", id);
}

function editQuestion(id) {
    console.log("Editar pregunta:", id);
}

function editUser(id) {
    console.log("Editar usuario:", id);
}

function viewResult(id) {
    console.log("Ver resultado:", id);
}

function downloadPDF(id) {
    window.open(`${API}/results/${id}/pdf`, "_blank");
}

// ================== LOGOUT ==================
document.getElementById("logoutBtn")
    ?.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });

// ================== INICIALIZACIÓN ==================
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    loadTopics();
    loadQuestions();
    loadUsers();
    loadResults();
});
