const express = require("express");
const path = require("path");
const fs = require("fs");

const login_route = require('./routes/login_route');
const topics_route = require('./routes/topics_route');
const questions_route = require('./routes/questions_route');
const users_route = require('./routes/users_route');
const results_route = require('./routes/results_route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/login', login_route);
app.use('/api/topics', topics_route);
app.use('/api/questions', questions_route);
app.use('/api/users', users_route);
app.use('/api/results', results_route);


app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});



/*
GET /api/topics
GET /api/questions
POST /api/topics
POST /api/questions
GET /api/users
GET /api/results
*/