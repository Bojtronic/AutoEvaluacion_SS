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
                    <td>
                        <button onclick="editTopic(${topic.id}, '${topic.name.replace(/'/g, "\\'")}', '${(topic.description || "").replace(/'/g, "\\'")}')">
                            Editar
                        </button>
                        <button onclick="deleteTopic(${topic.id})" class="btn-danger">
                            Eliminar
                        </button>
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

// Editar Tema
function editTopic(id, currentName, currentDescription) {

    openModal("Editar Tema", `
        <label>Nombre</label>
        <input type="text" id="topicName" value="${currentName}">

        <label>Descripción</label>
        <textarea id="topicDescription">${currentDescription || ""}</textarea>
    `);

    modalSaveBtn.onclick = async () => {
        const name = document.getElementById("topicName").value.trim();
        const description = document.getElementById("topicDescription").value.trim();

        if (!name || !description) {
            alert("Por favor complete ambos campos");
            return;
        }

        try {
            await apiFetch(`${API}/topics/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description })
            });

            closeModal();
            loadTopics();
            loadDashboard();

        } catch (error) {
            alert("Error actualizando tema");
            console.error(error);
        }
    };
}

// Eliminar Tema
async function deleteTopic(id) {

    if (!confirm("¿Seguro que desea eliminar este tema? Se eliminarán también sus preguntas asociadas.")) {
        return;
    }

    try {
        await apiFetch(`${API}/topics/${id}`, {
            method: "DELETE"
        });

        loadTopics();
        loadDashboard();

    } catch (error) {
        alert("No se pudo eliminar el tema");
        console.error(error);
    }
}

// ================== PREGUNTAS ==================
async function loadQuestions() {
    try {
        const topicFilter = document.getElementById("topicFilter").value;
        let url = `${API}/questions`;

        if (topicFilter) {
            url = `${API}/questions/by_topic?topic_id=${topicFilter}`;
        }

        const questions = await apiFetch(url);
        const table = document.getElementById("questionsTable");
        table.innerHTML = "";

        questions.forEach(q => {
            table.innerHTML += `
                <tr>
                    <td>${q.question_text}</td>
                    <td>${q.topic_name}</td>
                    <td>
                        <button onclick="editQuestion(${q.id}, '${q.question_text.replace(/'/g, "\\'")}', ${q.topic_id})">
                            Editar
                        </button>
                        <button onclick="deleteQuestion(${q.id})" class="btn-danger">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando preguntas:", error);
    }
}

async function loadTopicFilter() {
    try {
        const topics = await apiFetch(`${API}/topics`);
        const select = document.getElementById("topicFilter");

        select.innerHTML = `<option value="">-- Todos los temas --</option>`;

        topics.forEach(t => {
            select.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });

    } catch (error) {
        console.error("Error cargando filtro de temas:", error);
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
                        question_text
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

document.getElementById("topicFilter")
    ?.addEventListener("change", loadQuestions);

async function editQuestion(id, currentText, currentTopicId) {

    try {
        const topics = await apiFetch(`${API}/topics`);

        const topicOptions = topics
            .map(t => `
                <option value="${t.id}" ${t.id == currentTopicId ? "selected" : ""}>
                    ${t.name}
                </option>
            `)
            .join("");

        openModal("Editar Pregunta", `
            <label>Tema</label>
            <select id="questionTopic">${topicOptions}</select>

            <label>Enunciado</label>
            <textarea id="questionText">${currentText}</textarea>
        `);

        modalSaveBtn.onclick = async () => {

            const topic_id = document.getElementById("questionTopic").value;
            const question_text = document.getElementById("questionText").value.trim();

            if (!question_text) {
                alert("Debe ingresar la pregunta");
                return;
            }

            await apiFetch(`${API}/questions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic_id,
                    question_text
                })
            });

            closeModal();
            loadQuestions();
            loadDashboard();
        };

    } catch (error) {
        console.error("Error editando pregunta:", error);
    }
}

async function deleteQuestion(id) {

    if (!confirm("¿Seguro que desea eliminar esta pregunta?")) {
        return;
    }

    try {
        await apiFetch(`${API}/questions/${id}`, {
            method: "DELETE"
        });

        loadQuestions();
        loadDashboard();

    } catch (error) {
        alert("No se pudo eliminar la pregunta");
        console.error(error);
    }
}

// ================== EXAMENES ==================
document.getElementById("addExamBtn")
    ?.addEventListener("click", () => {

        document.getElementById("builderTitle").innerText = "Nuevo Examen";
        document.getElementById("examName").value = "";

        document.getElementById("examBuilder").style.display = "block";

        currentExamId = null;
    });

document.getElementById("cancelExamBtn")
    ?.addEventListener("click", () => {
        document.getElementById("examBuilder").style.display = "none";
    });

let currentExamId = null;

document.getElementById("saveExamBtn")
    ?.addEventListener("click", async () => {

        const name = document.getElementById("examName").value.trim();

        if (!name) {
            alert("Debe ingresar nombre del examen");
            return;
        }

        try {

            if (currentExamId) {
                // UPDATE
                await apiFetch(`${API}/exams/${currentExamId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name })
                });
            } else {
                // CREATE
                await apiFetch(`${API}/exams`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name })
                });
            }

            document.getElementById("examBuilder").style.display = "none";
            loadExams();

        } catch (error) {
            console.error("Error guardando examen:", error);
        }
    });

function editExam(id, name) {

    currentExamId = id;

    document.getElementById("builderTitle").innerText = "Editar Examen";
    document.getElementById("examName").value = name;
    document.getElementById("examBuilder").style.display = "block";
}

async function deleteExam(id) {

    if (!confirm("¿Seguro que desea eliminar este examen?")) return;

    try {
        await apiFetch(`${API}/exams/${id}`, {
            method: "DELETE"
        });

        loadExams();

    } catch (error) {
        console.error("Error eliminando examen:", error);
    }
}



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
        window.location.href = "../index.html";
    });

// ================== NAVEGACIÓN ==================
const menuItems = document.querySelectorAll("#menuList li");
const sections = document.querySelectorAll(".section");

menuItems.forEach(item => {
    item.addEventListener("click", () => {

        // Quitar active del menú
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        // Ocultar todas las secciones
        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        // Mostrar sección seleccionada
        const target = item.getAttribute("data-section");
        document.getElementById(target).classList.add("active-section");

        // Cargar datos según sección
        switch (target) {
            case "dashboard":
                loadDashboard();
                break;
            case "topics":
                loadTopics();
                break;
            case "questions":
                loadTopicFilter();
                loadQuestions();
                break;
            case "exams":
                loadExams();
                break;
            case "users":
                loadUsers();
                break;
            case "results":
                loadResults();
                break;
        }
    });
});

// ================== INICIALIZACIÓN ==================
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});
