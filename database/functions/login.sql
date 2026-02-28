CREATE OR REPLACE FUNCTION fn_users_login(
    p_username VARCHAR,
    p_password TEXT
)
RETURNS TABLE (
    user_id INTEGER,
    role VARCHAR,
    exam_id INTEGER,
    exam_name VARCHAR,
    attempts_allowed INTEGER,
    used_attempts INTEGER,
    remaining_attempts INTEGER
)
AS $$
DECLARE
    v_user RECORD;
    v_exam RECORD;
BEGIN

    -- Validar usuario
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

    -- ADMIN
    IF LOWER(v_user.role_name) = 'admin' THEN
        RETURN QUERY
        SELECT 
            v_user.id,
            v_user.role_name,
            NULL::INTEGER,
            NULL::VARCHAR,
            NULL::INTEGER,
            NULL::INTEGER,
            NULL::INTEGER;
        RETURN;
    END IF;

    -- STUDENT
    IF LOWER(v_user.role_name) = 'student' THEN

        SELECT 
            l.exam_id,
            e.name,
            l.attempts_allowed
        INTO v_exam
        FROM user_exam_limits l
        JOIN exams e ON e.id = l.exam_id
        WHERE l.user_id = v_user.id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'No tiene examen asignado';
        END IF;

        IF v_exam.attempts_allowed < 1 THEN
            RAISE EXCEPTION 'No le quedan intentos disponibles';
        END IF;

        RETURN QUERY
        SELECT
            v_user.id,
            v_user.role_name,
            v_exam.exam_id,
            v_exam.name,
            v_exam.attempts_allowed,
            NULL::INTEGER,
            v_exam.attempts_allowed;

        RETURN;
    END IF;

END;
$$ LANGUAGE plpgsql;
