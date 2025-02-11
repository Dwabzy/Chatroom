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

CREATE TABLE visitor_details
(
    assigned_agent_id varchar(40),
    visitor_id varchar(40),
    visitor_ip varchar(16),
    chatroom_name varchar(30),
    has_joined_chat boolean,
    visitor_name varchar(50),
    visitor_details varchar(300),
    online boolean
);

CREATE TABLE chat
(
    agent_id varchar(40),
    visitor_id varchar(40),
    sender varchar(40),
    message varchar(500),
    time_sent datetime
);


