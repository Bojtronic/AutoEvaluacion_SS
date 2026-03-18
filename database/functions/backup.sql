CREATE OR REPLACE FUNCTION fn_backup_get_all()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN

    SELECT json_build_object(

        'roles', (SELECT json_agg(r) FROM roles r),
        'users', (SELECT json_agg(u) FROM users u),
        'topics', (SELECT json_agg(t) FROM topics t),
        'questions', (SELECT json_agg(q) FROM questions q),
        'options', (SELECT json_agg(o) FROM options o),

        'exams', (SELECT json_agg(e) FROM exams e),
        'exam_topics', (SELECT json_agg(et) FROM exam_topics et),
        'exam_questions', (SELECT json_agg(eq) FROM exam_questions eq),

        'user_exam_limits', (SELECT json_agg(uel) FROM user_exam_limits uel),

        'attempts', (SELECT json_agg(a) FROM attempts a),
        'attempt_answers', (SELECT json_agg(aa) FROM attempt_answers aa)

    )
    INTO result;

    RETURN result;

END;
$$ LANGUAGE plpgsql;




------------------------------------------------------------------------------------------------




CREATE OR REPLACE FUNCTION fn_backup_get_images()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN

    SELECT json_agg(
        json_build_object(
            'id', oi.id,
            'option_id', oi.option_id,
            'image_data', encode(oi.image_data, 'base64'),
            'mime_type', oi.mime_type,
            'file_name', oi.file_name
        )
    )
    INTO result
    FROM option_images oi;

    RETURN result;

END;
$$ LANGUAGE plpgsql;







----------------------------------------------------------------------------------------------





CREATE OR REPLACE FUNCTION fn_backup_clear_all()
RETURNS VOID AS $$
BEGIN

    DELETE FROM attempt_answers;
    DELETE FROM attempts;
    DELETE FROM user_exam_limits;
    DELETE FROM exam_questions;
    DELETE FROM exam_topics;
    DELETE FROM exams;
    DELETE FROM options;
    DELETE FROM questions;
    DELETE FROM topics;
    DELETE FROM users;
    DELETE FROM roles;

END;
$$ LANGUAGE plpgsql;






------------------------------------------------------------------------------------------------





CREATE OR REPLACE FUNCTION fn_backup_restore(p_data JSON)
RETURNS VOID AS $$
DECLARE
    item JSON;
BEGIN

    PERFORM fn_backup_clear_all();

    -- ================= ROLES =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'roles', '[]'::json))
    LOOP
        INSERT INTO roles(id, name)
        VALUES (
            (item->>'id')::INT,
            item->>'name'
        );
    END LOOP;

    -- ================= USERS =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'users', '[]'::json))
    LOOP
        INSERT INTO users(id, username, password_hash, role_id, active)
        VALUES (
            (item->>'id')::INT,
            item->>'username',
            item->>'password_hash',
            (item->>'role_id')::INT,
            (item->>'active')::BOOLEAN
        );
    END LOOP;

    -- ================= TOPICS =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'topics', '[]'::json))
    LOOP
        INSERT INTO topics(id, name, description)
        VALUES (
            (item->>'id')::INT,
            item->>'name',
            item->>'description'
        );
    END LOOP;

    -- ================= QUESTIONS =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'questions', '[]'::json))
    LOOP
        INSERT INTO questions(id, topic_id, question_text)
        VALUES (
            (item->>'id')::INT,
            (item->>'topic_id')::INT,
            item->>'question_text'
        );
    END LOOP;

    -- ================= OPTIONS =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'options', '[]'::json))
    LOOP
        INSERT INTO options(id, question_id, option_text, is_correct)
        VALUES (
            (item->>'id')::INT,
            (item->>'question_id')::INT,
            item->>'option_text',
            (item->>'is_correct')::BOOLEAN
        );
    END LOOP;

    -- ================= EXAMS =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'exams', '[]'::json))
    LOOP
        INSERT INTO exams(id, name)
        VALUES (
            (item->>'id')::INT,
            item->>'name'
        );
    END LOOP;

    -- ================= RELACIONES =================
    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'exam_topics', '[]'::json))
    LOOP
        INSERT INTO exam_topics(id, exam_id, topic_id)
        VALUES (
            (item->>'id')::INT,
            (item->>'exam_id')::INT,
            (item->>'topic_id')::INT
        );
    END LOOP;

    FOR item IN 
        SELECT * FROM json_array_elements(COALESCE(p_data->'exam_questions', '[]'::json))
    LOOP
        INSERT INTO exam_questions(id, exam_id, question_id)
        VALUES (
            (item->>'id')::INT,
            (item->>'exam_id')::INT,
            (item->>'question_id')::INT
        );
    END LOOP;

END;
$$ LANGUAGE plpgsql;





-----------------------------------------------------------------------------------------------





CREATE OR REPLACE FUNCTION fn_backup_restore_images(p_images JSON)
RETURNS VOID AS $$
DECLARE
    item JSON;
BEGIN

    FOR item IN SELECT * FROM json_array_elements(p_images)
    LOOP
        INSERT INTO option_images(id, option_id, image_data, mime_type, file_name)
        VALUES (
            (item->>'id')::INT,
            (item->>'option_id')::INT,
            decode(item->>'image_data', 'base64'),
            item->>'mime_type',
            item->>'file_name'
        );
    END LOOP;

END;
$$ LANGUAGE plpgsql;






------------------------------------------------------------------------------------------------








