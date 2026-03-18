-- Obtener todas las preguntas (con nombre del tema)
CREATE OR REPLACE FUNCTION fn_questions_get_all()
RETURNS TABLE (
    id INTEGER,
    topic_id INTEGER,
    topic_name VARCHAR,
    question_text TEXT,
    options JSON
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.topic_id,
        t.name,
        q.question_text,

        (
            SELECT json_agg(
                json_build_object(
                    'id', o.id,
                    'text', o.option_text,
                    'is_correct', o.is_correct,
                    'has_image', EXISTS (
                        SELECT 1
                        FROM option_images oi
                        WHERE oi.option_id = o.id
                    )
                )
            )
            FROM options o
            WHERE o.question_id = q.id
        ) AS options

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
    question_text TEXT,
    options JSON
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.topic_id,
        t.name,
        q.question_text,

        (
            SELECT json_agg(
                json_build_object(
                    'id', o.id,
                    'text', o.option_text,
                    'is_correct', o.is_correct,
                    'has_image', EXISTS (
                        SELECT 1
                        FROM option_images oi
                        WHERE oi.option_id = o.id
                    )
                )
            )
            FROM options o
            WHERE o.question_id = q.id
        ) AS options

    FROM questions q
    INNER JOIN topics t ON t.id = q.topic_id
    WHERE q.id = p_id;

END;
$$ LANGUAGE plpgsql;


-- Crear pregunta con opciones
CREATE OR REPLACE FUNCTION fn_questions_create(
    p_topic_id INTEGER,
    p_question_text TEXT,
    p_options JSON
)
RETURNS JSON
AS $$
DECLARE
    v_question_id INTEGER;
    v_option JSON;
    v_option_id INTEGER;
    v_options_result JSON[] := ARRAY[]::JSON[];
BEGIN
    -- Validar que el tema exista
    IF NOT EXISTS (
        SELECT 1 
        FROM topics 
        WHERE id = p_topic_id
    ) THEN
        RAISE EXCEPTION 'El tema no existe';
    END IF;

    -- Validar que existan opciones
    IF p_options IS NULL OR json_array_length(p_options) = 0 THEN
        RAISE EXCEPTION 'Debe enviar al menos una opción';
    END IF;

    -- Validar que exista al menos una opción correcta
    IF NOT EXISTS (
        SELECT 1
        FROM json_array_elements(p_options) elem
        WHERE (elem->>'is_correct')::BOOLEAN = true
    ) THEN
        RAISE EXCEPTION 'Debe existir al menos una opción correcta';
    END IF;

    -- Insertar pregunta
    INSERT INTO questions (topic_id, question_text)
    VALUES (p_topic_id, p_question_text)
    RETURNING id INTO v_question_id;

    -- Insertar opciones y capturar IDs
    FOR v_option IN 
        SELECT * FROM json_array_elements(p_options)
    LOOP
        INSERT INTO options (
            question_id,
            option_text,
            is_correct
        )
        VALUES (
            v_question_id,
            v_option->>'option_text',
            (v_option->>'is_correct')::BOOLEAN
        )
        RETURNING id INTO v_option_id;

        -- Guardar id en array JSON
        v_options_result := array_append(
            v_options_result,
            json_build_object('id', v_option_id)
        );
    END LOOP;

    -- Retornar JSON completo
    RETURN json_build_object(
        'question_id', v_question_id,
        'options', v_options_result
    );

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


-- Obtener preguntas por tema
CREATE OR REPLACE FUNCTION fn_questions_get_by_topic(p_topic_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    topic_id INTEGER,
    topic_name VARCHAR,
    question_text TEXT,
    options JSON
)
AS $$
BEGIN
    -- Validar que el tema exista
    IF NOT EXISTS (
        SELECT 1 FROM topics t WHERE t.id = p_topic_id
    ) THEN
        RAISE EXCEPTION 'El tema no existe';
    END IF;

    RETURN QUERY
    SELECT 
        q.id,
        q.topic_id,
        t.name,
        q.question_text,

        (
            SELECT json_agg(
                json_build_object(
                    'id', o.id,
                    'text', o.option_text,
                    'is_correct', o.is_correct,
                    'has_image', EXISTS (
                        SELECT 1
                        FROM option_images oi
                        WHERE oi.option_id = o.id
                    )
                )
            )
            FROM options o
            WHERE o.question_id = q.id
        ) AS options

    FROM questions q
    INNER JOIN topics t ON t.id = q.topic_id
    WHERE q.topic_id = p_topic_id
    ORDER BY q.id;

END;
$$ LANGUAGE plpgsql;

