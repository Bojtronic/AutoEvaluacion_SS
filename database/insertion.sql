INSERT INTO roles (name) VALUES ('admin'), ('student');

INSERT INTO users (username, password_hash, role_id, active)
VALUES
('admin', crypt('admin', gen_salt('bf')), 1, TRUE),
('manuel', crypt('123', gen_salt('bf')), 2, TRUE),
('ana', crypt('123', gen_salt('bf')), 2, TRUE);

INSERT INTO topics (name, description) VALUES
('Matemática', 'Operaciones básicas'),
('Programación', 'Conceptos básicos');

INSERT INTO questions (topic_id, question_text) VALUES
(1,'2 + 2 = ?'),
(1,'5 x 3 = ?'),
(2,'Lenguaje del navegador?'),
(2,'Significado de API?');

-- Pregunta 1
INSERT INTO options (question_id, option_text, is_correct) VALUES
(1,'3',FALSE),(1,'4',TRUE),(1,'5',FALSE),(1,'6',FALSE);

-- Pregunta 2
INSERT INTO options VALUES
(DEFAULT,2,'10',FALSE),
(DEFAULT,2,'15',TRUE),
(DEFAULT,2,'20',FALSE),
(DEFAULT,2,'25',FALSE);

-- Pregunta 3
INSERT INTO options VALUES
(DEFAULT,3,'Python',FALSE),
(DEFAULT,3,'JavaScript',TRUE),
(DEFAULT,3,'C++',FALSE),
(DEFAULT,3,'Java',FALSE);

-- Pregunta 4
INSERT INTO options VALUES
(DEFAULT,4,'Application Programming Interface',TRUE),
(DEFAULT,4,'Archivo',FALSE),
(DEFAULT,4,'Ninguna',FALSE),
(DEFAULT,4,'Sistema',FALSE);

INSERT INTO exams (name) VALUES ('Examen General');

INSERT INTO exam_questions (exam_id, question_id) VALUES
(1,1),(1,2),(1,3),(1,4);

INSERT INTO attempts (user_id, exam_id, attempt_number, score, started_at, finished_at)
VALUES
(2,1,1,100,NOW() - INTERVAL '1 hour', NOW() - INTERVAL '50 minutes'),
(3,1,1,50,NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '30 minutes');

-- Manuel (correctas)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, is_correct)
SELECT 1, q.id, o.id, o.is_correct
FROM questions q
JOIN options o ON o.question_id = q.id
WHERE o.is_correct = TRUE;

-- Ana (algunas incorrectas)
INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, is_correct)
SELECT 2, q.id, o.id, o.is_correct
FROM questions q
JOIN options o ON o.question_id = q.id
WHERE (q.id = 1 AND o.option_text = '3')
   OR (q.id = 2 AND o.option_text = '15')
   OR (q.id = 3 AND o.option_text = 'Python')
   OR (q.id = 4 AND o.option_text = 'Application Programming Interface');

   