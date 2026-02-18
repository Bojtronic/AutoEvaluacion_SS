const express = require("express");
const path = require("path");
const fs = require("fs");

const login_route = require('./routes/login_route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint para preguntas
app.get("/api/questions", (req, res) => {
    const filePath = path.join(__dirname, "data", "questions.json");
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
});

app.use('/api/login', login_route);

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
