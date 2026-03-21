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

    -- ================= LIMPIAR BD =================
    PERFORM fn_backup_clear_all();

    -- ================= ROLES =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'roles') = 'array'
            THEN p_data->'roles' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO roles(id, name)
        VALUES (
            (item->>'id')::INT,
            item->>'name'
        );
    END LOOP;

    -- ================= USERS =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'users') = 'array'
            THEN p_data->'users' ELSE '[]'::json END
        )
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
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'topics') = 'array'
            THEN p_data->'topics' ELSE '[]'::json END
        )
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
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'questions') = 'array'
            THEN p_data->'questions' ELSE '[]'::json END
        )
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
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'options') = 'array'
            THEN p_data->'options' ELSE '[]'::json END
        )
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
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'exams') = 'array'
            THEN p_data->'exams' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO exams(id, name)
        VALUES (
            (item->>'id')::INT,
            item->>'name'
        );
    END LOOP;

    -- ================= EXAM_TOPICS =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'exam_topics') = 'array'
            THEN p_data->'exam_topics' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO exam_topics(id, exam_id, topic_id)
        VALUES (
            (item->>'id')::INT,
            (item->>'exam_id')::INT,
            (item->>'topic_id')::INT
        );
    END LOOP;

    -- ================= EXAM_QUESTIONS =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'exam_questions') = 'array'
            THEN p_data->'exam_questions' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO exam_questions(id, exam_id, question_id)
        VALUES (
            (item->>'id')::INT,
            (item->>'exam_id')::INT,
            (item->>'question_id')::INT
        );
    END LOOP;

    -- ================= USER_EXAM_LIMITS =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'user_exam_limits') = 'array'
            THEN p_data->'user_exam_limits' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO user_exam_limits(id, user_id, exam_id, attempts_allowed)
        VALUES (
            (item->>'id')::INT,
            (item->>'user_id')::INT,
            (item->>'exam_id')::INT,
            (item->>'attempts_allowed')::INT
        );
    END LOOP;

    -- ================= ATTEMPTS =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'attempts') = 'array'
            THEN p_data->'attempts' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO attempts(id, user_id, exam_id, attempt_number, score, started_at, finished_at)
        VALUES (
            (item->>'id')::INT,
            (item->>'user_id')::INT,
            (item->>'exam_id')::INT,
            (item->>'attempt_number')::INT,
            (item->>'score')::NUMERIC,
            (item->>'started_at')::TIMESTAMP,
            (item->>'finished_at')::TIMESTAMP
        );
    END LOOP;

    -- ================= ATTEMPT_ANSWERS =================
    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data->'attempt_answers') = 'array'
            THEN p_data->'attempt_answers' ELSE '[]'::json END
        )
    LOOP
        INSERT INTO attempt_answers(id, attempt_id, question_id, selected_option_id, is_correct)
        VALUES (
            (item->>'id')::INT,
            (item->>'attempt_id')::INT,
            (item->>'question_id')::INT,
            (item->>'selected_option_id')::INT,
            (item->>'is_correct')::BOOLEAN
        );
    END LOOP;

    -- ================= RESET SEQUENCES =================
    PERFORM setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 1));
    PERFORM setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
    PERFORM setval('topics_id_seq', COALESCE((SELECT MAX(id) FROM topics), 1));
    PERFORM setval('questions_id_seq', COALESCE((SELECT MAX(id) FROM questions), 1));
    PERFORM setval('options_id_seq', COALESCE((SELECT MAX(id) FROM options), 1));
    PERFORM setval('exams_id_seq', COALESCE((SELECT MAX(id) FROM exams), 1));
    PERFORM setval('exam_topics_id_seq', COALESCE((SELECT MAX(id) FROM exam_topics), 1));
    PERFORM setval('exam_questions_id_seq', COALESCE((SELECT MAX(id) FROM exam_questions), 1));
    PERFORM setval('user_exam_limits_id_seq', COALESCE((SELECT MAX(id) FROM user_exam_limits), 1));
    PERFORM setval('attempts_id_seq', COALESCE((SELECT MAX(id) FROM attempts), 1));
    PERFORM setval('attempt_answers_id_seq', COALESCE((SELECT MAX(id) FROM attempt_answers), 1));

END;
$$ LANGUAGE plpgsql;





-----------------------------------------------------------------------------------------------





CREATE OR REPLACE FUNCTION fn_backup_restore_images(p_data JSON)
RETURNS VOID AS $$
DECLARE
    item JSON;
BEGIN

    FOR item IN 
        SELECT * FROM json_array_elements(
            CASE WHEN json_typeof(p_data) = 'array'
            THEN p_data ELSE '[]'::json END
        )
    LOOP
        INSERT INTO option_images(option_id, image_data, mime_type, file_name)
        VALUES (
            (item->>'option_id')::INT,
            decode(item->>'image_data', 'base64'),
            item->>'mime_type',
            item->>'file_name'
        );
    END LOOP;

END;
$$ LANGUAGE plpgsql;






------------------------------------------------------------------------------------------------








