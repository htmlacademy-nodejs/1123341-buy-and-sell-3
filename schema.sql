DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "offers" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "offer_categories" CASCADE;

CREATE TABLE categories(
  /*работает как SERIAL, но вдобавок следит, чтобы пользователь в принципе не мог сгенерировать id вручную*/
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL, /*должно быть уникальным для каждого юзера*/
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);

CREATE TABLE offers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  sum integer NOT NULL,
  type varchar(5) NOT NULL,
  picture varchar(50),
  user_id integer NOT NULL,
  created_at timestamp DEFAULT current_timestamp, /*Автоматическое заполнение времени при создании*/
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  offer_id integer NOT NULL,
  user_id integer NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp, /*Автоматическое заполнение времени при создании*/
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
);

CREATE TABLE offer_categories(
  offer_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

/*Что это значит?????????????????*/
/*Производим поиск по заголовкам объявлений. Чтобы поиск работал быстрее, создадим индекс*/
CREATE INDEX ON offers(title);
