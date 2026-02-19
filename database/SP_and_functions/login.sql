CREATE OR REPLACE FUNCTION fn_users_login(
    p_username VARCHAR,
    p_password TEXT
)
RETURNS TABLE (
    role VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.name
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    WHERE u.username = p_username
      AND u.password_hash = crypt(p_password, u.password_hash)
      AND u.active = TRUE;
END;
$$ LANGUAGE plpgsql;
