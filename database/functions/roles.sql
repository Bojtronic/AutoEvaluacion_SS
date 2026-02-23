CREATE OR REPLACE FUNCTION fn_roles_get_all()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name
    FROM roles r;
END;
$$ LANGUAGE plpgsql;