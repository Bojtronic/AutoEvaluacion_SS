-- Obtener todas las preguntas (con nombre del tema)
CREATE OR REPLACE FUNCTION fn_questions_get_all()
RETURNS TABLE (
    id INTEGER,
    topic_id INTEGER,
    topic_name VARCHAR,
    question_text TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.topic_id,
        t.name,
        q.question_text
    FROM questions q
    INNER JOIN topics t ON t.id = q.topic_id
    ORDER BY q.id;
END;
$$ LANGUAGE plpgsql;


-- Obtener por ID
CREATE OR REPLACE FUNCTION fn_questions_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    topic_id INTEGER,
    topic_name VARCHAR,
    question_text TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.topic_id,
        t.name,
        q.question_text
    FROM questions q
    INNER JOIN topics t ON t.id = q.topic_id
    WHERE q.id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Crear pregunta
CREATE OR REPLACE FUNCTION fn_questions_create(
    p_topic_id INTEGER,
    p_question_text TEXT
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM topics WHERE id = p_topic_id
    ) THEN
        RAISE EXCEPTION 'El tema no existe';
    END IF;

    INSERT INTO questions (topic_id, question_text)
    VALUES (p_topic_id, p_question_text);
END;
$$ LANGUAGE plpgsql;



-- Actualizar pregunta
CREATE OR REPLACE FUNCTION fn_questions_update(
    p_id INTEGER,
    p_topic_id INTEGER,
    p_question_text TEXT
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM questions WHERE id = p_id
    ) THEN
        RAISE EXCEPTION 'La pregunta no existe';
    END IF;

    UPDATE questions
    SET topic_id = p_topic_id,
        question_text = p_question_text
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Eliminar tema
CREATE OR REPLACE FUNCTION fn_questions_delete(p_id INTEGER)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM questions WHERE id = p_id
    ) THEN
        RAISE EXCEPTION 'La pregunta no existe';
    END IF;

    DELETE FROM questions
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


