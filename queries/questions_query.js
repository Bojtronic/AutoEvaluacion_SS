const get = "SELECT * FROM fn_questions_get_all()";
const getById = "SELECT * FROM fn_questions_get_by_id($1)";
const getByTopic = "SELECT * FROM fn_questions_get_by_topic($1)";
const add = "SELECT fn_questions_create($1, $2, $3) AS result";
const update = "SELECT fn_questions_update($1, $2, $3)";
const remove = "SELECT fn_questions_delete($1)";

const upsertOptionImage = `
    INSERT INTO option_images (option_id, image_data, mime_type, file_name)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (option_id)
    DO UPDATE SET
        image_data = EXCLUDED.image_data,
        mime_type = EXCLUDED.mime_type,
        file_name = EXCLUDED.file_name
`;

const getOptionImage = `
    SELECT image_data, mime_type
    FROM option_images
    WHERE option_id = $1
`;

module.exports = {
    get,
    getById,
    getByTopic,
    add,
    update,
    remove,
    upsertOptionImage,
    getOptionImage
};

