document.getElementById("loginForm").addEventListener("submit", async function(e) {
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            errorMsg.textContent = data.message || "Credenciales incorrectas.";
            return;
        }

        // Guardar sesión simple
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", username);

        // Redirección según rol
        if (data.role === "admin") {
            window.location.href = "admin.html";
        } else if (data.role === "student") {
            window.location.href = "quiz.html";
        } else {
            errorMsg.textContent = "No reconocido.";
        }

    } catch (error) {
        console.error("Error en login:", error);
        errorMsg.textContent = "Error de conexión con el servidor.";
    }
});
