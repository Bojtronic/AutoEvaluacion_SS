INSERT INTO roles (name)
VALUES 
    ('admin'),
    ('student');


INSERT INTO users (username, password_hash, role_id, active)
VALUES
('tames', crypt('ss', gen_salt('bf')), 1, TRUE),
('manuel', crypt('369', gen_salt('bf')), 2, TRUE),
('fulanito', crypt('abc', gen_salt('bf')), 2, TRUE);


INSERT INTO topics (name, description) VALUES
('Matemática', 'Operaciones básicas y álgebra'),
('Programación', 'Conceptos fundamentales de desarrollo'),
('Base de Datos', 'SQL y modelado relacional');


INSERT INTO questions (topic_id, question_text) VALUES
-- Matemática
(1, '¿Cuánto es 2 + 2?'),
(1, '¿Cuánto es 5 x 3?'),
(1, '¿Raíz cuadrada de 16?'),

-- Programación
(2, '¿Qué lenguaje se ejecuta en el navegador?'),
(2, '¿Qué significa API?'),
(2, '¿Qué estructura repite código?'),

-- Base de Datos
(3, '¿Qué significa SQL?'),
(3, '¿Qué comando inserta datos?'),
(3, '¿Qué clave identifica un registro?');


INSERT INTO options (question_id, option_text, is_correct) VALUES
(1,'3',FALSE),
(1,'4',TRUE),
(1,'5',FALSE),
(1,'6',FALSE);

-- Pregunta 2
INSERT INTO options VALUES
(DEFAULT,2,'10',FALSE),
(DEFAULT,2,'15',TRUE),
(DEFAULT,2,'20',FALSE),
(DEFAULT,2,'25',FALSE);

-- Pregunta 3
INSERT INTO options VALUES
(DEFAULT,3,'2',FALSE),
(DEFAULT,3,'4',TRUE),
(DEFAULT,3,'8',FALSE),
(DEFAULT,3,'16',FALSE);

-- Pregunta 4
INSERT INTO options VALUES
(DEFAULT,4,'Python',FALSE),
(DEFAULT,4,'JavaScript',TRUE),
(DEFAULT,4,'C++',FALSE),
(DEFAULT,4,'Java',FALSE);

-- Pregunta 5
INSERT INTO options VALUES
(DEFAULT,5,'Aplicación de Programación Interna',FALSE),
(DEFAULT,5,'Application Programming Interface',TRUE),
(DEFAULT,5,'Archivo de Programa Integrado',FALSE),
(DEFAULT,5,'Ninguna',FALSE);

-- Pregunta 6
INSERT INTO options VALUES
(DEFAULT,6,'IF',FALSE),
(DEFAULT,6,'FOR',TRUE),
(DEFAULT,6,'SELECT',FALSE),
(DEFAULT,6,'WHERE',FALSE);

-- Pregunta 7
INSERT INTO options VALUES
(DEFAULT,7,'Structured Query Language',TRUE),
(DEFAULT,7,'Simple Query Logic',FALSE),
(DEFAULT,7,'System Query Level',FALSE),
(DEFAULT,7,'None',FALSE);

-- Pregunta 8
INSERT INTO options VALUES
(DEFAULT,8,'INSERT',TRUE),
(DEFAULT,8,'UPDATE',FALSE),
(DEFAULT,8,'DELETE',FALSE),
(DEFAULT,8,'CREATE',FALSE);

-- Pregunta 9
INSERT INTO options VALUES
(DEFAULT,9,'Foreign Key',FALSE),
(DEFAULT,9,'Primary Key',TRUE),
(DEFAULT,9,'Index',FALSE),
(DEFAULT,9,'Unique',FALSE);


INSERT INTO exams (name) VALUES
('Examen Matemática Básica'),
('Examen Programación Inicial'),
('Examen Base de Datos');


INSERT INTO exam_topics (exam_id, topic_id, question_limit) VALUES
(1,1,3),
(2,2,3),
(3,3,3);


INSERT INTO exam_questions (exam_id, question_id) VALUES
(1,1),(1,2),(1,3),
(2,4),(2,5),(2,6),
(3,7),(3,8),(3,9);


INSERT INTO user_exam_limits (user_id, exam_id, max_attempts) VALUES
(2,1,2),
(2,2,2),
(3,3,1);


INSERT INTO attempts (user_id, exam_id, attempt_number, score, started_at, finished_at)
VALUES
(2,1,1,100,NOW() - INTERVAL '1 hour', NOW() - INTERVAL '50 minutes'),
(2,2,1,66.67,NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '30 minutes'),
(3,3,1,33.33,NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '10 minutes');


INSERT INTO attempt_answers (attempt_id, question_id, selected_option_id, is_correct)
SELECT 1, question_id, id, is_correct
FROM options
WHERE question_id = 1 AND is_correct = TRUE;



