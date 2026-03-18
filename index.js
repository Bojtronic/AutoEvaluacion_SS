const express = require("express");
const fileUpload = require("express-fileupload");

const path = require("path");
const fs = require("fs");

// Rutas
const login_route = require('./routes/login_route');
const topics_route = require('./routes/topics_route');
const questions_route = require('./routes/questions_route');
const exams_route = require('./routes/exams_route');
const roles_route = require('./routes/roles_route');
const users_route = require('./routes/users_route');
const results_route = require('./routes/results_route');
const backupRoutes = require('./routes/backup_routes');

const app = express();
const port = process.env.PORT || 3000;

// ================== MIDDLEWARES ==================

// JSON
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// FILE UPLOAD
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB (ajusta si quieres)
    abortOnLimit: true,
    createParentPath: true
}));

// ================== RUTAS ==================

app.use('/api/login', login_route);
app.use('/api/topics', topics_route);
app.use('/api/questions', questions_route);
app.use('/api/exams', exams_route);
app.use('/api/roles', roles_route);
app.use('/api/users', users_route);
app.use('/api/results', results_route);

// BACKUP
app.use('/api/backup', backupRoutes);

// ================== SERVIDOR ==================

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});