-- Obtener todos los temas
CREATE OR REPLACE FUNCTION fn_topics_get_all()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    description TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name, t.description
    FROM topics t
    ORDER BY t.id;
END;
$$ LANGUAGE plpgsql;


-- Obtener por ID
CREATE OR REPLACE FUNCTION fn_topics_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    description TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name, t.description
    FROM topics t
    WHERE t.id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Crear tema
CREATE OR REPLACE FUNCTION fn_topics_create(
    p_name VARCHAR,
    p_description TEXT
)
RETURNS VOID
AS $$
BEGIN
    INSERT INTO topics (name, description)
    VALUES (p_name, p_description);
END;
$$ LANGUAGE plpgsql;


-- Actualizar tema
CREATE OR REPLACE FUNCTION fn_topics_update(
    p_id INTEGER,
    p_name VARCHAR,
    p_description TEXT
)
RETURNS VOID
AS $$
BEGIN
    UPDATE topics
    SET name = p_name,
        description = p_description
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Eliminar tema
CREATE OR REPLACE FUNCTION fn_topics_delete(p_id INTEGER)
RETURNS VOID
AS $$
BEGIN
    DELETE FROM topics
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


