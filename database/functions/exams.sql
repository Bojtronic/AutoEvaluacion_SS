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
RETURNS INTEGER
AS $$
DECLARE
    v_exam_id INTEGER;
BEGIN
    IF TRIM(p_name) = '' THEN
        RAISE EXCEPTION 'El nombre no puede estar vacío';
    END IF;

    INSERT INTO exams (name)
    VALUES (p_name)
    RETURNING id INTO v_exam_id;

    RETURN v_exam_id;
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
    id INTEGER,
    question_text TEXT,
    topic_id INTEGER
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
        q.question_text,
        q.topic_id
    FROM exam_questions eq
    INNER JOIN questions q ON q.id = eq.question_id
    WHERE eq.exam_id = p_exam_id
    ORDER BY q.id;
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

-- Inicio de examen para 1 usuario
CREATE OR REPLACE FUNCTION fn_start_exam(
    p_user_id INTEGER,
    p_exam_id INTEGER
)
RETURNS TABLE (
    attempt_id INTEGER,
    question_id INTEGER,
    topic VARCHAR,
    question TEXT,
    option_id INTEGER,
    option_text TEXT
)
AS $$
DECLARE
    v_max_attempts INTEGER;
    v_used_attempts INTEGER;
    v_attempt_number INTEGER;
    v_attempt_id INTEGER;
BEGIN

    -- Validar que el examen esté asignado
    SELECT max_attempts
    INTO v_max_attempts
    FROM user_exam_limits
    WHERE user_id = p_user_id
      AND exam_id = p_exam_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El examen no está asignado al usuario';
    END IF;

    -- Contar intentos usados
    SELECT COUNT(*)
    INTO v_used_attempts
    FROM attempts
    WHERE user_id = p_user_id
      AND exam_id = p_exam_id;

    IF v_used_attempts >= v_max_attempts THEN
        RAISE EXCEPTION 'No le quedan intentos disponibles';
    END IF;

    -- Calcular número de intento
    v_attempt_number := v_used_attempts + 1;

    -- Crear intento
    INSERT INTO attempts (
        user_id,
        exam_id,
        attempt_number,
        started_at
    )
    VALUES (
        p_user_id,
        p_exam_id,
        v_attempt_number,
        NOW()
    )
    RETURNING id INTO v_attempt_id;

    -- Devolver preguntas y opciones
    RETURN QUERY
    SELECT
        v_attempt_id,
        q.id,
        t.name,
        q.question_text,
        o.id,
        o.option_text
    FROM exam_questions eq
    JOIN questions q ON q.id = eq.question_id
    JOIN topics t ON t.id = q.topic_id
    JOIN options o ON o.question_id = q.id
    WHERE eq.exam_id = p_exam_id
    ORDER BY t.name, q.id;

END;
$$ LANGUAGE plpgsql;


-- Fin de examen para 1 usuario
CREATE OR REPLACE FUNCTION fn_finish_exam(
    p_attempt_id INTEGER,
    p_answers JSON
)
RETURNS TABLE (
    score NUMERIC,
    correct INTEGER,
    incorrect INTEGER
)
AS $$
DECLARE
    v_total INTEGER;
    v_correct INTEGER;
    v_score NUMERIC;
BEGIN

    -- Insertar respuestas
    INSERT INTO attempt_answers (
        attempt_id,
        question_id,
        selected_option_id,
        is_correct
    )
    SELECT
        p_attempt_id,
        (elem->>'question_id')::INTEGER,
        (elem->>'selected_option_id')::INTEGER,
        o.is_correct
    FROM json_array_elements(p_answers) elem
    JOIN options o
        ON o.id = (elem->>'selected_option_id')::INTEGER
       AND o.question_id = (elem->>'question_id')::INTEGER;

    -- Calcular totales
    SELECT COUNT(*)
    INTO v_total
    FROM attempt_answers
    WHERE attempt_id = p_attempt_id;

    SELECT COUNT(*)
    INTO v_correct
    FROM attempt_answers
    WHERE attempt_id = p_attempt_id
      AND is_correct = TRUE;

    v_score := ROUND((v_correct::NUMERIC / v_total) * 100, 2);

    -- Actualizar intento
    UPDATE attempts
    SET score = v_score,
        finished_at = NOW()
    WHERE id = p_attempt_id;

    RETURN QUERY
    SELECT
        v_score,
        v_correct,
        (v_total - v_correct);

END;
$$ LANGUAGE plpgsql;