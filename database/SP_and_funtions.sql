CREATE OR REPLACE FUNCTION authenticate_user(
    p_username VARCHAR,
    p_password VARCHAR
)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
    v_role VARCHAR;
BEGIN
    SELECT r.name
    INTO v_role
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.username = p_username
      AND u.active = TRUE
      AND u.password_hash = crypt(p_password, u.password_hash);

    RETURN v_role;
END;
$$;
