-- Obtener todos los resultados (vista administrador)
CREATE OR REPLACE FUNCTION fn_results_all()
RETURNS TABLE (
    attempt_id INTEGER,
    username VARCHAR,
    exam_name VARCHAR,
    attempt_number INTEGER,
    score NUMERIC,
    started_at TIMESTAMP,
    finished_at TIMESTAMP
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        u.username,
        e.name,
        a.attempt_number,
        a.score,
        a.started_at,
        a.finished_at
    FROM attempts a
    INNER JOIN users u ON u.id = a.user_id
    INNER JOIN exams e ON e.id = a.exam_id
    ORDER BY a.finished_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;


-- Crear intento
CREATE OR REPLACE FUNCTION fn_attempt_create(
    p_user_id INTEGER,
    p_exam_id INTEGER
)
RETURNS INTEGER
AS $$
DECLARE
    v_attempt_number INTEGER;
    v_max_attempts INTEGER;
    v_attempt_id INTEGER;
BEGIN
    -- Obtener máximo permitido
    SELECT COALESCE(max_attempts, 1)
    INTO v_max_attempts
    FROM user_exam_limits
    WHERE user_id = p_user_id
      AND exam_id = p_exam_id;

    -- Si no existe configuración, default = 1
    IF v_max_attempts IS NULL THEN
        v_max_attempts := 1;
    END IF;

    -- Calcular intento actual
    SELECT COUNT(*) + 1
    INTO v_attempt_number
    FROM attempts
    WHERE user_id = p_user_id
      AND exam_id = p_exam_id;

    IF v_attempt_number > v_max_attempts THEN
        RAISE EXCEPTION 'Ha alcanzado el número máximo de intentos permitidos';
    END IF;

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

    RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql;


-- Guardar respuesta
CREATE OR REPLACE FUNCTION fn_attempt_answer_save(
    p_attempt_id INTEGER,
    p_question_id INTEGER,
    p_selected_option_id INTEGER
)
RETURNS VOID
AS $$
DECLARE
    v_is_correct BOOLEAN;
BEGIN
    -- Verificar si la opción es correcta
    SELECT is_correct
    INTO v_is_correct
    FROM options
    WHERE id = p_selected_option_id
      AND question_id = p_question_id;

    IF v_is_correct IS NULL THEN
        RAISE EXCEPTION 'Opción inválida';
    END IF;

    INSERT INTO attempt_answers (
        attempt_id,
        question_id,
        selected_option_id,
        is_correct
    )
    VALUES (
        p_attempt_id,
        p_question_id,
        p_selected_option_id,
        v_is_correct
    );
END;
$$ LANGUAGE plpgsql;


-- Finalizar intento y calcular nota (0–100)
CREATE OR REPLACE FUNCTION fn_attempt_finish(
    p_attempt_id INTEGER
)
RETURNS NUMERIC
AS $$
DECLARE
    v_total INTEGER;
    v_correct INTEGER;
    v_score NUMERIC(5,2);
BEGIN
    SELECT COUNT(*) INTO v_total
    FROM attempt_answers
    WHERE attempt_id = p_attempt_id;

    SELECT COUNT(*) INTO v_correct
    FROM attempt_answers
    WHERE attempt_id = p_attempt_id
      AND is_correct = TRUE;

    IF v_total = 0 THEN
        RAISE EXCEPTION 'No hay respuestas registradas';
    END IF;

    v_score := (v_correct::NUMERIC / v_total::NUMERIC) * 100;

    UPDATE attempts
    SET score = v_score,
        finished_at = NOW()
    WHERE id = p_attempt_id;

    RETURN v_score;
END;
$$ LANGUAGE plpgsql;


-- Obtener resultados de un estudiante
CREATE OR REPLACE FUNCTION fn_results_by_user(
    p_user_id INTEGER
)
RETURNS TABLE (
    attempt_id INTEGER,
    exam_name VARCHAR,
    attempt_number INTEGER,
    score NUMERIC,
    started_at TIMESTAMP,
    finished_at TIMESTAMP
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        e.name,
        a.attempt_number,
        a.score,
        a.started_at,
        a.finished_at
    FROM attempts a
    INNER JOIN exams e ON e.id = a.exam_id
    WHERE a.user_id = p_user_id
    ORDER BY a.started_at DESC;
END;
$$ LANGUAGE plpgsql;


-- Obtener detalle completo de un intento
CREATE OR REPLACE FUNCTION fn_attempt_detail(
    p_attempt_id INTEGER
)
RETURNS TABLE (
    question_id INTEGER,
    question_text TEXT,
    selected_option TEXT,
    is_correct BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.question_text,
        o.option_text,
        aa.is_correct
    FROM attempt_answers aa
    INNER JOIN questions q ON q.id = aa.question_id
    INNER JOIN options o ON o.id = aa.selected_option_id
    WHERE aa.attempt_id = p_attempt_id;
END;
$$ LANGUAGE plpgsql;

