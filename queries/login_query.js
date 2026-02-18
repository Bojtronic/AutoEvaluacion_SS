const auth = "SELECT * FROM authenticate_user($1, $2);";

module.exports = {
    auth
}