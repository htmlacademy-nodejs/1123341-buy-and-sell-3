-- Полная информация по объявлению
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
  GROUP BY offers.id, users.id

-- Пять свежих комментариев
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Все комментарии к объявлению
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 1
  ORDER BY comments.created_at DESC

-- Два объявления о покупке
SELECT * FROM offers
WHERE type = 'OFFER'
  LIMIT 2

-- Обновить заголовок
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1

-- Категории и количество их упоминаний в объявлениях
SELECT
  categories.id,
  categories.name,

  /*(3) По COUNT(!!мне!!) мы можем понять - сколько строк в таблице, т.к. наименования столбца оригинальные*/
  COUNT(offer_categories.offer_id)
FROM categories

  /*(1) Узнаем какой offer_categories.offer_id соответствует categories.id.
    (2) По offer_categories.category_id считаются повторения*/
  LEFT JOIN offer_categories ON categories.id = offer_categories.category_id
  GROUP BY categories.id


-- Полная информация по всем объявлениям
SELECT
  offers.title,
  users.first_name,
  COUNT(comments.id) AS comments_count,

  /*Конкатенируем categories.name для соответствующих offers.id (связано с JOIN categories...)*/
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM offers

  /*Узнаем какой offer_categories.category_id соответствует offers.id*/
  JOIN offer_categories ON offers.id = offer_categories.offer_id

  /*Узнаем какие categories.name соответствует offers.id*/
  JOIN categories ON offer_categories.category_id = categories.id

  /*Узнаем какой comments.id соответствует offers.id*/
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id

  /*В итоговой таблице максимальное количество строк из представленных колонок*/
  GROUP BY offers.id, users.id
  ORDER BY offers.created_at DESC

