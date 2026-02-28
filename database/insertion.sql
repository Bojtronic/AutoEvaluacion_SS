-- ==========================================
-- ROLES
-- ==========================================
INSERT INTO roles (name)
VALUES 
('admin'),
('student');

-- ==========================================
-- USERS
-- ==========================================
INSERT INTO users (username, password_hash, role_id, active)
VALUES
('admin', crypt('admin', gen_salt('bf')), 1, TRUE),
('manuel', crypt('123', gen_salt('bf')), 2, TRUE),
('ana', crypt('123', gen_salt('bf')), 2, TRUE),
('carlos', crypt('123', gen_salt('bf')), 2, TRUE);

-- ==========================================
-- TOPICS
-- ==========================================
INSERT INTO topics (name, description) VALUES
('Matemática', 'Operaciones básicas'),
('Programación', 'Conceptos fundamentales'),
('Redes', 'Conceptos básicos de redes');

-- ==========================================
-- QUESTIONS
-- ==========================================
INSERT INTO questions (topic_id, question_text) VALUES
(1,'2 + 2 = ?'),
(1,'10 / 2 = ?'),
(2,'Lenguaje que corre en el navegador?'),
(2,'¿Qué significa API?'),
(3,'¿Qué protocolo se usa para páginas web?'),
(3,'Puerto por defecto de HTTPS?');

-- ==========================================
-- OPTIONS
-- ==========================================

-- Pregunta 1
INSERT INTO options (question_id, option_text, is_correct) VALUES
(1,'3',FALSE),(1,'4',TRUE),(1,'5',FALSE),(1,'6',FALSE);

-- Pregunta 2
INSERT INTO options (question_id, option_text, is_correct) VALUES
(2,'2',FALSE),(2,'5',TRUE),(2,'10',FALSE),(2,'20',FALSE);

-- Pregunta 3
INSERT INTO options (question_id, option_text, is_correct) VALUES
(3,'Python',FALSE),(3,'JavaScript',TRUE),(3,'C++',FALSE),(3,'Java',FALSE);

-- Pregunta 4
INSERT INTO options (question_id, option_text, is_correct) VALUES
(4,'Application Programming Interface',TRUE),
(4,'Archivo de Programa Interno',FALSE),
(4,'Advanced Protocol Integration',FALSE),
(4,'Ninguna',FALSE);

-- Pregunta 5
INSERT INTO options (question_id, option_text, is_correct) VALUES
(5,'HTTP',TRUE),(5,'FTP',FALSE),(5,'SMTP',FALSE),(5,'SSH',FALSE);

-- Pregunta 6
INSERT INTO options (question_id, option_text, is_correct) VALUES
(6,'80',FALSE),(6,'21',FALSE),(6,'443',TRUE),(6,'25',FALSE);

-- ==========================================
-- EXAMS
-- ==========================================
INSERT INTO exams (name) VALUES
('Examen General'),
('Examen Técnico');

-- ==========================================
-- RELACIÓN EXAMEN - TOPICS
-- ==========================================
INSERT INTO exam_topics (exam_id, topic_id) VALUES
(1,1),(1,2),(1,3),
(2,2),(2,3);

-- ==========================================
-- RELACIÓN EXAMEN - QUESTIONS
-- ==========================================
INSERT INTO exam_questions (exam_id, question_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),
(2,3),(2,4),(2,5),(2,6);

-- ==========================================
-- USER EXAM LIMITS (Nuevo modelo)
-- ==========================================
INSERT INTO user_exam_limits (user_id, exam_id, attempts_allowed) VALUES
(2,1,2),  -- Manuel tiene 2 intentos disponibles
(3,1,1),  -- Ana tiene 1 intento disponible
(4,2,3);  -- Carlos tiene 3 intentos disponibles

-- ==========================================
-- ATTEMPTS HISTÓRICOS
-- ==========================================

-- Manuel ya hizo 1 intento
INSERT INTO attempts (user_id, exam_id, attempt_number, score, started_at, finished_at)
VALUES
(2,1,1,100,NOW() - INTERVAL '2 hour', NOW() - INTERVAL '1 hour 50 minutes');

-- Ana ya hizo 1 intento (sin intentos restantes luego de finish)
INSERT INTO attempts (user_id, exam_id, attempt_number, score, started_at, finished_at)
VALUES
(3,1,1,50,NOW() - INTERVAL '1 hour', NOW() - INTERVAL '50 minutes');

-- ==========================================
-- ATTEMPT ANSWERS
-- ==========================================

-- Manuel (todas correctas)
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
   OR (q.id = 2 AND o.option_text = '5')
   OR (q.id = 3 AND o.option_text = 'Python')
   OR (q.id = 4 AND o.option_text = 'Application Programming Interface')
   OR (q.id = 5 AND o.option_text = 'HTTP')
   OR (q.id = 6 AND o.option_text = '80');

