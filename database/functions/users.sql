--  Obtener todos los usuarios (con nombre de rol)
CREATE OR REPLACE FUNCTION fn_users_get_all()
RETURNS TABLE (
    id INTEGER,
    username VARCHAR,
    role_id INTEGER,
    role_name VARCHAR,
    active BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.role_id,
        r.name,
        u.active
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    ORDER BY u.id;
END;
$$ LANGUAGE plpgsql;


-- Obtener por ID
CREATE OR REPLACE FUNCTION fn_users_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    username VARCHAR,
    role_id INTEGER,
    role_name VARCHAR,
    active BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.role_id,
        r.name,
        u.active
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    WHERE u.id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Crear usuario (con hash automático)
CREATE OR REPLACE FUNCTION fn_users_create(
    p_username VARCHAR,
    p_password TEXT,
    p_role_id INTEGER
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM roles WHERE id = p_role_id
    ) THEN
        RAISE EXCEPTION 'El rol no existe';
    END IF;

    INSERT INTO users (username, password_hash, role_id)
    VALUES (
        p_username,
        crypt(p_password, gen_salt('bf')),
        p_role_id
    );
END;
$$ LANGUAGE plpgsql;


-- Actualizar usuario
CREATE OR REPLACE FUNCTION fn_users_update(
    p_id INTEGER,
    p_username VARCHAR,
    p_role_id INTEGER,
    p_active BOOLEAN
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = p_id
    ) THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    UPDATE users
    SET username = p_username,
        role_id = p_role_id,
        active = p_active
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Cambiar contraseña
CREATE OR REPLACE FUNCTION fn_users_change_password(
    p_id INTEGER,
    p_new_password TEXT
)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = p_id
    ) THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    UPDATE users
    SET password_hash = crypt(p_new_password, gen_salt('bf'))
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Asignación de examen e intentos a un usuario
CREATE OR REPLACE FUNCTION fn_users_assign_exam(
    p_user_id INTEGER,
    p_exam_id INTEGER,
    p_max_attempts INTEGER
)
RETURNS VOID
AS $$
DECLARE
    v_role_name VARCHAR;
BEGIN

    -- Validar usuario
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = p_user_id
    ) THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    -- Obtener rol
    SELECT r.name
    INTO v_role_name
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    WHERE u.id = p_user_id;

    IF LOWER(TRIM(v_role_name)) <> 'student' THEN
        RAISE EXCEPTION 'Solo los estudiantes pueden tener examen asignado';
    END IF;

    -- Validar examen
    IF NOT EXISTS (
        SELECT 1 FROM exams WHERE id = p_exam_id
    ) THEN
        RAISE EXCEPTION 'El examen no existe';
    END IF;

    IF p_max_attempts <= 0 THEN
        RAISE EXCEPTION 'La cantidad de intentos debe ser mayor a 0';
    END IF;

    -- UPSERT: actualizar si existe, insertar si no
    IF EXISTS (
        SELECT 1 FROM user_exam_limits
        WHERE user_id = p_user_id
    ) THEN

        UPDATE user_exam_limits
        SET exam_id = p_exam_id,
            max_attempts = p_max_attempts
        WHERE user_id = p_user_id;

    ELSE

        INSERT INTO user_exam_limits (user_id, exam_id, max_attempts)
        VALUES (p_user_id, p_exam_id, p_max_attempts);

    END IF;

END;
$$ LANGUAGE plpgsql;

-- Eliminar usuario
CREATE OR REPLACE FUNCTION fn_users_delete(p_id INTEGER)
RETURNS VOID
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = p_id
    ) THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    DELETE FROM users
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

