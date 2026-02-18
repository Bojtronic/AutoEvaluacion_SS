INSERT INTO roles (name)
VALUES 
    ('admin'),
    ('student');


INSERT INTO users (username, password_hash, role_id)
VALUES (
    'tames',
    crypt('ss', gen_salt('bf')),
    1
);


INSERT INTO users (username, password_hash, role_id)
VALUES (
    'manuel',
    crypt('369', gen_salt('bf')),
    2
);
