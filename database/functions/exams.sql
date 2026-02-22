-- Obtener todos los exámenes
CREATE OR REPLACE FUNCTION fn_exams_get_all()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT e.id, e.name
    FROM exams e
    ORDER BY e.id;
END;
$$ LANGUAGE plpgsql;


-- Obtener por ID
CREATE OR REPLACE FUNCTION fn_exams_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR
)
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    RETURN QUERY
    SELECT e.id, e.name
    FROM exams e
    WHERE e.id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Crear examen
CREATE OR REPLACE FUNCTION fn_exams_create(p_name VARCHAR)
RETURNS VOID
AS $$
BEGIN
    IF TRIM(p_name) = '' THEN
        RAISE EXCEPTION 'El nombre no puede estar vacío';
    END IF;

    INSERT INTO exams (name)
    VALUES (p_name);
END;
$$ LANGUAGE plpgsql;


--- Actualizar examen
CREATE OR REPLACE FUNCTION fn_exams_update(
    p_id INTEGER,
    p_name VARCHAR
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    UPDATE exams
    SET name = p_name
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Eliminar examen
CREATE OR REPLACE FUNCTION fn_exams_delete(p_id INTEGER)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    DELETE FROM exams
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Obtener temas asociados a un examen
CREATE OR REPLACE FUNCTION fn_exam_topics_get_by_exam(p_exam_id INTEGER)
RETURNS TABLE (
    topic_id INTEGER,
    topic_name VARCHAR
)
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_exam_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    RETURN QUERY
    SELECT 
        t.id,
        t.name
    FROM exam_topics et
    INNER JOIN topics t ON t.id = et.topic_id
    WHERE et.exam_id = p_exam_id
    ORDER BY t.id;
END;
$$ LANGUAGE plpgsql;


-- Asignar tema a examen
CREATE OR REPLACE FUNCTION fn_exam_topics_add(
    p_exam_id INTEGER,
    p_topic_id INTEGER
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_exam_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM topics t WHERE t.id = p_topic_id
    ) THEN
        RAISE EXCEPTION 'El tema no existe';
    END IF;

    INSERT INTO exam_topics (exam_id, topic_id)
    VALUES (p_exam_id, p_topic_id)
    ON CONFLICT (exam_id, topic_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;


-- Eliminar tema de examen
CREATE OR REPLACE FUNCTION fn_exam_topics_remove(
    p_exam_id INTEGER,
    p_topic_id INTEGER
)
RETURNS VOID
AS $$
BEGIN
    DELETE FROM exam_topics
    WHERE exam_id = p_exam_id
      AND topic_id = p_topic_id;
END;
$$ LANGUAGE plpgsql;


-- Obtener preguntas asociadas a un examen
CREATE OR REPLACE FUNCTION fn_exam_questions_get_by_exam(p_exam_id INTEGER)
RETURNS TABLE (
    question_id INTEGER,
    question_text TEXT
)
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_exam_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    RETURN QUERY
    SELECT 
        q.id,
        q.question_text
    FROM exam_questions eq
    INNER JOIN questions q ON q.id = eq.question_id
    WHERE eq.exam_id = p_exam_id
    ORDER BY q.id;
END;
$$ LANGUAGE plpgsql;


-- Asignar pregunta a examen
CREATE OR REPLACE FUNCTION fn_exam_questions_add(
    p_exam_id INTEGER,
    p_question_id INTEGER
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM exams e WHERE e.id = p_exam_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM questions q WHERE q.id = p_question_id
    ) THEN
        RAISE EXCEPTION 'La pregunta no existe';
    END IF;

    INSERT INTO exam_questions (exam_id, question_id)
    VALUES (p_exam_id, p_question_id)
    ON CONFLICT (exam_id, question_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;


-- Eliminar pregunta de examen
CREATE OR REPLACE FUNCTION fn_exam_questions_remove(
    p_exam_id INTEGER,
    p_question_id INTEGER
)
RETURNS VOID
AS $$
BEGIN
    DELETE FROM exam_questions
    WHERE exam_id = p_exam_id
      AND question_id = p_question_id;
END;
$$ LANGUAGE plpgsql;

