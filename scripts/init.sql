DROP DATABASE IF EXISTS urbanapplause;
CREATE DATABASE urbanapplause;

\c urbanapplause;

CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  bio VARCHAR,
  hash_pass VARCHAR NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  lat VARCHAR NOT NULL,
  lng VARCHAR NOT NULL,
  google_place_id INTEGER,
  city VARCHAR,
  formatted_address VARCHAR,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  image VARCHAR NOT NULL,
  description VARCHAR,
  date_posted TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  artist_id INTEGER REFERENCES artists (id) NOT NULL,
  user_id INTEGER REFERENCES users (id) NOT NULL,
  location_id INTEGER REFERENCES locations (id) NOT NULL
);

CREATE TABLE applause (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts (id) NOT NULL,
  user_id INTEGER REFERENCES users (id) NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO artists (name)
  VALUES ('Beethoven');

INSERT INTO users (username, email, bio, hash_pass)
  VALUES ('flannerykj', 'flannj@gmail.com', 'its me', 'kjksjdkfjl344');

INSERT INTO users (username, email, bio, hash_pass)
  VALUES ('claire', 'clarekennedy@gmail.com', 'its a user', 'kjksjdkfjl344');

INSERT INTO locations (lng, lat, formatted_address, city)
  VALUES ('47', '-73', '199 howland', 'Toronto');

INSERT INTO posts (image, description, artist_id, user_id, location_id)
  VALUES ('https://upload.wikimedia.org/wikipedia/commons/9/94/2009_010_CES_utka.JPG', 'some random photo', 1, 1, 1);

  INSERT INTO posts (image, description, artist_id, user_id, location_id)
  VALUES ('https://upload.wikimedia.org/wikipedia/commons/9/94/2009_010_CES_utka.JPG', 'some random photo', 1, 1, 1);


INSERT INTO applause (post_id, user_id)
  VALUES (1, 2);

