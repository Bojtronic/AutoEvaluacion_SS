document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    // Usuarios simulados
    const users = [
        { username: "admin", password: "admin123", role: "admin" },
        { username: "manuel", password: "1234", role: "user" }
    ];

    const user = users.find(u => 
        u.username === username && u.password === password
    );

    if (!user) {
        errorMsg.textContent = "Usuario o contraseña incorrectos.";
        return;
    }

    // Guardar sesión simple
    localStorage.setItem("role", user.role);
    localStorage.setItem("username", user.username);

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "quiz.html";
    }
});
