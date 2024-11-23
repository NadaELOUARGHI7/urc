CREATE TABLE users (
   user_id serial PRIMARY KEY,
   username VARCHAR ( 50 ) UNIQUE NOT NULL,
   password VARCHAR ( 100 ) NOT NULL,
   email VARCHAR ( 255 ) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
   last_login TIMESTAMP,
   external_id VARCHAR ( 50 ) UNIQUE NOT NULL
);

CREATE TABLE rooms (
   room_id serial PRIMARY KEY,
   name VARCHAR ( 50 ) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
   created_by INTEGER NOT NULL
);


CREATE TABLE messages (
   message_id SERIAL PRIMARY KEY,
   sender_id INTEGER NOT NULL,
   receiver_id INTEGER NOT NULL,
   content VARCHAR(255) NOT NULL,
   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE room_messages (
    room_message_id SERIAL PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(room_id),
    sender_id INT NOT NULL REFERENCES users(user_id),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into users (username, password, email, created_on, external_id) values ('test', 'gcrjEewWyAuYskG3dd6gFTqsC6/SKRsbTZ+g1XHDO10=', 'test@univ-brest.fr', now(), 'ac7a25a9-bcc5-4fba-8a3d-d42acda26949');

insert into rooms (name, created_on, created_by) values ('General', now(), 4);
insert into rooms (name, created_on, created_by) values ('News', now(), 4);
insert into rooms (name, created_on, created_by) values ('Random', now(), 4);

INSERT INTO messages (sender_id, receiver_id, content) VALUES (1, 5, 'Hello, how are you?');
INSERT INTO messages (sender_id, receiver_id, content) VALUES (5, 1, 'Hello, i am fine and you?');
INSERT INTO messages (sender_id, receiver_id, content) VALUES (1, 6 , 'Hello, TEST0');


INSERT INTO room_messages (room_id, sender_id, content, timestamp) VALUES (1, 1, 'Hello everyone!', NOW());
INSERT INTO room_messages (room_id, sender_id, content, timestamp) VALUES (1, 5, 'Hello!', NOW());
INSERT INTO room_messages (room_id, sender_id, content, timestamp) VALUES (1, 5, 'How are you all its me nada ', NOW());
