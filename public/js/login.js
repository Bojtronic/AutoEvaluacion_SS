document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (!username || !password) {
        errorMsg.textContent = "Debe ingresar usuario y contraseña.";
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            errorMsg.textContent = data.message;
            return;
        }

            

        // Guardar sesión
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", username);
        localStorage.setItem("user_id", data.user_id);

        if (data.role === "admin") {
            window.location.href = "admin.html";
            return;
        }

        if (data.role === "student") {

            if (!data.exam) {
                errorMsg.textContent = "No tiene examen asignado.";
                return;
            }

            if (data.exam.remaining_attempts <= 0) {
                errorMsg.textContent = "No le quedan intentos disponibles.";
                return;
            }

            // Guardar datos del examen
            localStorage.setItem("exam_id", data.exam.exam_id);
            localStorage.setItem("exam_name", data.exam.exam_name);
            localStorage.setItem("remaining_attempts", data.exam.remaining_attempts);

            window.location.href = "quiz.html";
            return;
        }

    } catch (error) {
        console.error("Error en login:", error);
        errorMsg.textContent = "Error de conexión con el servidor.";
    }
});
