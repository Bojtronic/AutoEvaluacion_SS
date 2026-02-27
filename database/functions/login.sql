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
BEGIN

    -- Buscar usuario con password correcto
    SELECT u.id, u.role_id, r.name AS role_name
    INTO v_user
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.username = p_username
      AND u.password_hash = crypt(p_password, u.password_hash)
      AND u.active = TRUE;

    -- ❌ Usuario no existe o password incorrecto
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario o contraseña incorrectos';
    END IF;

    -- ✅ Si es admin → permitir login directo
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

    -- Solo aplicar reglas extras a student
    IF LOWER(v_user.role_name) = 'student' THEN

        -- Validar que tenga examen asignado
        IF NOT EXISTS (
            SELECT 1
            FROM user_exam_limits
            WHERE user_id = v_user.id
        ) THEN
            RAISE EXCEPTION 'No tiene examen asignado';
        END IF;

        -- Retornar información completa
        RETURN QUERY
        SELECT
            v_user.id,
            v_user.role_name,
            e.id,
            e.name,
            l.max_attempts,
            COALESCE(COUNT(a.id), 0) AS used_attempts,
            (l.max_attempts - COALESCE(COUNT(a.id), 0)) AS remaining_attempts
        FROM user_exam_limits l
        JOIN exams e ON e.id = l.exam_id
        LEFT JOIN attempts a
            ON a.user_id = l.user_id
            AND a.exam_id = l.exam_id
        WHERE l.user_id = v_user.id
        GROUP BY e.id, e.name, l.max_attempts, v_user.id, v_user.role_name;

        -- Validar intentos restantes
        IF (
            SELECT (l.max_attempts - COALESCE(COUNT(a.id), 0))
            FROM user_exam_limits l
            LEFT JOIN attempts a
                ON a.user_id = l.user_id
                AND a.exam_id = l.exam_id
            WHERE l.user_id = v_user.id
            GROUP BY l.max_attempts
        ) <= 0 THEN
            RAISE EXCEPTION 'No le quedan intentos disponibles';
        END IF;

        RETURN;
    END IF;

END;
$$ LANGUAGE plpgsql;