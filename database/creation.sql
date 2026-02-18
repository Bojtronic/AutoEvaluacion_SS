CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    UNIQUE(id, question_id)
);

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150)
);

CREATE TABLE exam_topics (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(id),
    question_limit INTEGER,
    UNIQUE (exam_id, topic_id)
);

CREATE TABLE exam_questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    UNIQUE (exam_id, question_id)
);

-- Control de intentos permitidos
CREATE TABLE user_exam_limits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    max_attempts INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_id, exam_id)
);

CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    exam_id INTEGER REFERENCES exams(id),
    attempt_number INTEGER,
    score NUMERIC(5,2),
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    UNIQUE (user_id, exam_id, attempt_number)
);

CREATE TABLE attempt_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER REFERENCES attempts(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    selected_option_id INTEGER,
    is_correct BOOLEAN,
    FOREIGN KEY (selected_option_id, question_id)
        REFERENCES options(id, question_id)
);
