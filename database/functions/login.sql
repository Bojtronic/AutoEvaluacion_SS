CREATE OR REPLACE FUNCTION fn_users_login(
    p_username VARCHAR,
    p_password TEXT
)
RETURNS TABLE (
    user_id INTEGER,
    role VARCHAR,
    exam_id INTEGER,
    exam_name VARCHAR,
    max_attempts INTEGER,
    used_attempts INTEGER,
    remaining_attempts INTEGER
)
AS $$
DECLARE
    v_user RECORD;
    v_remaining_attempts INTEGER;
BEGIN

    -- Buscar usuario válido
    SELECT 
        u.id,
        r.name AS role_name
    INTO v_user
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.username = p_username
      AND u.password_hash = crypt(p_password, u.password_hash)
      AND u.active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario o contraseña incorrectos';
    END IF;


    -- ==============================
    -- ADMIN
    -- ==============================
    IF LOWER(v_user.role_name) = 'admin' THEN
        RETURN QUERY
        SELECT 
            v_user.id::INTEGER,
            v_user.role_name::VARCHAR,
            NULL::INTEGER,
            NULL::VARCHAR,
            NULL::INTEGER,
            NULL::INTEGER,
            NULL::INTEGER;
        RETURN;
    END IF;


    -- ==============================
    -- STUDENT
    -- ==============================
    IF LOWER(v_user.role_name) = 'student' THEN

        -- Validar examen asignado
        IF NOT EXISTS (
            SELECT 1
            FROM user_exam_limits l
            WHERE l.user_id = v_user.id
        ) THEN
            RAISE EXCEPTION 'No tiene examen asignado';
        END IF;


        -- Calcular intentos restantes
        SELECT 
            (l.max_attempts - COALESCE(COUNT(a.id), 0))
        INTO v_remaining_attempts
        FROM user_exam_limits l
        LEFT JOIN attempts a
            ON a.user_id = l.user_id
            AND a.exam_id = l.exam_id
        WHERE l.user_id = v_user.id
        GROUP BY l.max_attempts
        LIMIT 1;


        IF v_remaining_attempts IS NULL OR v_remaining_attempts <= 0 THEN
            RAISE EXCEPTION 'No le quedan intentos disponibles';
        END IF;


        -- Retornar datos completos
        RETURN QUERY
        SELECT
            v_user.id::INTEGER,
            v_user.role_name::VARCHAR,
            e.id::INTEGER,
            e.name::VARCHAR,
            l.max_attempts::INTEGER,
            COALESCE(COUNT(a.id), 0)::INTEGER AS used_attempts,
            (l.max_attempts - COALESCE(COUNT(a.id), 0))::INTEGER AS remaining_attempts
        FROM user_exam_limits l
        JOIN exams e ON e.id = l.exam_id
        LEFT JOIN attempts a
            ON a.user_id = l.user_id
            AND a.exam_id = l.exam_id
        WHERE l.user_id = v_user.id
        GROUP BY 
            e.id,
            e.name,
            l.max_attempts,
            v_user.id,
            v_user.role_name;

        RETURN;
    END IF;

END;
$$ LANGUAGE plpgsql;
