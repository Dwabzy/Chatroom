-- Create Database
CREATE DATABASE chatroom;
USE chatroom;
-- Create user_auth table
CREATE TABLE user_auth
(
    user_id varchar(40) PRIMARY KEY,
    firstname varchar(30),
    lastname varchar(30),
    email varchar(30),
    mobile_no varchar(15),
    username varchar(30),
    password varchar(50),
    is_admin boolean
);

--Create chatroom table

CREATE TABLE chatroom
(
    user_id varchar(40),
    chatroom_id varchar(40),
    chatroom_name varchar(30),
    first_message varchar(500),
    online_message varchar(500),
    offline_message varchar(500),
    idle_message varchar(500),
    entity_list varchar(255),
    chatbox_theme varchar(300),
    lastModified datetime
);


