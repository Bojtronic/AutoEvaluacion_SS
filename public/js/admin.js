// ================== PROTECCIÓN ==================
const role = localStorage.getItem("role");

if (role !== "admin") {
    window.location.href = "login.html";
}

// ================== NAVEGACIÓN ==================
const menuItems = document.querySelectorAll(".sidebar li");
const sections = document.querySelectorAll(".section");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const sectionId = item.dataset.section;

        sections.forEach(section =>
            section.classList.remove("active-section")
        );

        document
            .getElementById(sectionId)
            .classList.add("active-section");
    });
});

// ================== LOGOUT ==================
document.getElementById("logoutBtn")
    .addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });

// ================== MODAL ==================
const modal = document.getElementById("modal");
const overlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}

document.getElementById("closeModalBtn").onclick = closeModal;
document.getElementById("modalCancelBtn").onclick = closeModal;
overlay.onclick = closeModal;

// ================== NUEVA PREGUNTA ==================
const addQuestionBtn = document.getElementById("addQuestionBtn");

if (addQuestionBtn) {
    addQuestionBtn.addEventListener("click", () => {
        openModal("Nueva Pregunta", `
            <label>Tema</label>
            <select id="questionTopic"></select>

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
    });
}
