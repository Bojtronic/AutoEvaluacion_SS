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

