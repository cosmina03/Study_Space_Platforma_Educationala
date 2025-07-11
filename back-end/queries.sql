select * from elevi

update elevi set credite = 100

select * from profesori

insert into elevi values ('test', 'test')
alter table elevi add column credite INTEGER default 0

.schema participanti

select * from participanti

drop table participanti

delete from participanti

create table participanti
(email_participant text,
 id_curs INTEGER, 
 data_aderare TEXT,
 PRIMARY KEY(email_participant, id_curs) 
 )

alter table profesori add column nume text

delete from profesori

create table cursuri ( id INTEGER PRIMARY KEY AUTOINCREMENT, email_profesor TEXT, titlu TEXT, descriere TEXT, cost INTEGER)

alter table cursuri add column cale_poza TEXT

select * from cursuri

delete from cursuri where descriere = 'test p'

create table materiale
(id integer primary key AUTOINCREMENT, id_curs integer, titlu text, descriere text, cale_atasament TEXT, tip_atasament TEXT)

insert into materiale values (1, 11, 'Material 1', 'Descriere mat 1', null, null)
insert into materiale values (2, 11, 'Material 2', 'Descriere mat 2', null, null)

select * from teme
update teme set termen = '2025-06-30'
update teme set termen = '2025-03-30'

create table teme
(id integer primary key AUTOINCREMENT, id_curs integer, titlu text, descriere text, cale_atasament TEXT, tip_atasament TEXT, termen TEXT)


create table raspuns_tema
(id integer primary key AUTOINCREMENT, id_tema integer, 
cale_atasament TEXT, email_participant Text, tip_atasament TEXT)

create table feedback
(id integer primary key AUTOINCREMENT, id_rasp integer, 
cale_atasament TEXT, email_profesor Text, tip_atasament TEXT, text TEXT, nota integer)

select * from raspuns_tema

select * from feedback

select * from teme

      SELECT f.*, t.titlu FROM feedback f
        JOIN raspuns_tema r ON r.id = f.id_rasp
        JOIN teme t on r.id_tema = t.id
        WHERE f.id = 2

update feedback set id_rasp = 1


      SELECT r.*, r.id id_rasp, c.*, t.*, e.nume FROM raspuns_tema r
        JOIN teme t ON t.id = r.id_tema
        JOIN cursuri c ON c.id = t.id_curs
        JOIN elevi e ON e.email = r.email_participant
        WHERE c.email_profesor = 'test'
        AND r.id NOT IN ( SELECT id_rasp FROM feedback)


        SELECT f.nota, t.*
        FROM teme t
        LEFT JOIN raspuns_tema r on t.id = r.id_tema
        LEFT JOIN feedback f ON f.id_rasp = r.id
        WHERE t.id_curs = 13

CREATE TABLE abonamente
(id INTEGER PRIMARY KEY AUTOINCREMENT, cost NUMBER, credite INTEGER, 

delete from materiale

DELETE FROM cursuri
WHERE id IN (11, 12);


cati elevi avem in aplicatie
cati profesori avem in aplicatie
cate cursuri au fost vandute
cate materiale au fost publicate

select 
(select count(*) from elevi) elevi,
(select count(*) from profesori) profesori,
(select count(*) from cursuri) cursuri,
(select count(*) from materiale) materiale



        SELECT f.nota, f.text, f.id id_feedback, f.cale_atasament, t.*
        FROM teme t
        LEFT JOIN raspuns_tema r on t.id = r.id_tema AND r.email_participant = 'test10'
        LEFT JOIN feedback f ON f.id_rasp = r.id
        WHERE t.id_curs = 13



        create table progres_materiale(email_elev TEXT, id_mat INTEGER, completat INTEGER default 1)


SELECT total_materiale, total_completate, ((total_completate+0.0)/(total_materiale+0.0))*100 procent, medie FROM (
(SELECT count(*) total_materiale FROM materiale
WHERE id_curs = 13),
(SELECT count(*) total_completate 
FROM materiale m
JOIN progres_materiale p ON m.id = p.id_mat AND p.email_elev = 'test10' 
WHERE id_curs = 13 ),
(SELECT avg(f.nota) medie
FROM feedback f
JOIN raspuns_tema r ON f.id_rasp = r.id
WHERE r.email_participant = 'test10')
)

SELECT f.nota
FROM feedback f
JOIN raspuns_tema r ON f.id_rasp = r.id
WHERE r.email_participant = 'test10'

SELECT f.nota
  FROM feedback f
  JOIN raspuns_tema r ON f.id_rasp = r.id
  JOIN teme t on t.id = r.id_tema
  JOIN cursuri c on c.id = t.id_curs
  WHERE r.email_participant = 'test10' AND c.id = 13


  create table favorite(id integer PRIMARY KEY  AUTOINCREMENT, email_elev text, id_curs integer) 



            SELECT c.*, p.nume, f.id favorite
            FROM cursuri c
            JOIN profesori p
            ON c.email_profesor = p.email
            LEFT JOIN favorite f ON f.id_curs = c.id



CREATE TABLE rating(
        id_curs integer,
        email_elev text,
        rating tinyint,
        primary key(id_curs, email_elev)
);

drop table rating

Select count(*), luna from 
(
  SELECT substr(data_aderare, 6, 2) luna
  FROM participanti p
  JOIN cursuri c ON c.id = p.id_curs
  WHERE c.email_profesor = 'cosmina@gmail.com'
)
GROUP by luna


SELECT substr(data_aderare, 6, 2) luna, c.cost* count(p.email_participant) venit, count(p.email_participant) elevi
FROM participanti p
  JOIN cursuri c ON c.id = p.id_curs
  WHERE c.email_profesor = 'cosmina@gmail.com'
  group by  luna

    const topCursuri = [
    { titlu: 'Programare în Python', cumparatori: 45, incasari: 450 },
    { titlu: 'Bazele Economiei', cumparatori: 30, incasari: 300 },
    { titlu: 'JavaScript pentru Începători', cumparatori: 28, incasari: 280 }
  ];


SELECT count(distinct p.email_participant) total_elevi_unici
FROM participanti p
  JOIN cursuri c ON c.id = p.id_curs
  WHERE c.email_profesor = 'cosmina@gmail.com'

  SELECT c.*, p.nume, r.rating rating
            FROM cursuri c
            JOIN profesori p, participanti pa
            ON c.email_profesor = p.email
            AND pa.id_curs = c.id
            LEFT JOIN rating r ON r.id_curs = c.id

SELECT c.*, p.nume, r.rating
  FROM cursuri c
  JOIN participanti pa ON pa.id_curs = c.id
  JOIN profesori p ON c.email_profesor = p.email
  LEFT JOIN rating r ON r.id_curs = c.id AND r.email_elev = 'test10'
  WHERE pa.email_participant = 'test10'

  SELECT r.*, r.id id_rasp, c.*, t.*, e.nume FROM raspuns_tema r
        JOIN teme t ON t.id = r.id_tema
        JOIN cursuri c ON c.id = t.id_curs
        JOIN elevi e ON e.email = r.email_participant
        WHERE c.email_profesor = 'cosmina@gmail.com'
        AND r.id NOT IN ( SELECT id_rasp FROM feedback)


SELECT email_elev, total_materiale, total_completate, ((total_completate+0.0)/(total_materiale+0.0))*100 procent FROM (
(SELECT count(*) total_materiale FROM materiale
WHERE id_curs = 18),
(SELECT p.email_elev, count(*) total_completate 
FROM materiale m
LEFT JOIN progres_materiale p ON m.id = p.id_mat
LEFT JOIN elevi e on e.email = p.email_elev
WHERE id_curs = 18 
GROUP BY email_elev)
)


alter table profesori
add column cale_poza text default null


SELECT titlu FROM cursuri c
JOIN participanti p ON c.id = p.id_curs
WHERE p.email_participant = 'cosmina@gmail.com'

alter table rating
add column feedback_scris text

13,test10,4,
14,test10,5,
18,test10,5,
17,cosminadinita22@gmail.com,5,
17,test10,3,

.schema rating
drop table rating

CREATE TABLE rating(
        id_curs integer ,
        email_elev text ,
        rating tinyint , feedback_scris text ,
        primary key(id_curs, email_elev)
);


SELECT json_group_array(r.feedback_scris  )
, c.titlu, f.id favorit, c.id, p.nume, c.cale_poza, c.cost,
          (SELECT AVG(rating)
          FROM rating r
          WHERE r.id_curs = c.id) rating
            FROM cursuri c
            JOIN profesori p
            ON c.email_profesor = p.email
            LEFT JOIN favorite f ON f.id_curs = c.id
            LEFT JOIN rating r on r.id_curs = c.id
            group by titlu, favorit, c.id, nume, c.cale_poza,c.cost


             

SELECT c.titlu, f.id favorit, 
          (SELECT AVG(rating)
          FROM rating r
          WHERE r.id_curs = c.id) rating
            FROM cursuri c
            JOIN profesori p
            ON c.email_profesor = p.email
            LEFT JOIN favorite f ON f.id_curs = c.id


SELECT json_group_array(r.feedback_scris) lista_feedback, c.*, p.nume, f.id favorit, 
          (SELECT AVG(rating)
          FROM rating r
          WHERE r.id_curs = c.id) rating
            FROM cursuri c
            JOIN profesori p
            ON c.email_profesor = p.email
            LEFT JOIN favorite f ON f.id_curs = c.id
            LEFT JOIN rating r on c.id = r.id_curs

SELECT e.email AS email_elev,
       e.nume,
       COUNT(pm.id_mat) AS total_completate,
       (SELECT COUNT(*) FROM materiale WHERE id_curs = ?) AS total_materiale,
       (COUNT(pm.id_mat) * 100.0) / 
       NULLIF((SELECT COUNT(*) FROM materiale WHERE id_curs = ?), 0) AS procent
FROM elevi e
LEFT JOIN progres_materiale pm ON e.email = pm.email_elev
LEFT JOIN materiale m ON pm.id_mat = m.id AND m.id_curs = 13
WHERE e.email IN (
    SELECT email_elev FROM participanti WHERE id_curs = 13
)
GROUP BY e.email, e.nume

 SELECT * FROM participanti WHERE id_curs = 18

SELECT 
    e.nume,
    COALESCE(
        (COUNT(pm.id_mat) * 100.0) / 
        NULLIF((SELECT COUNT(*) FROM materiale WHERE id_curs = ?), 0), 
        0
    ) AS procent
FROM elevi e
LEFT JOIN progres_materiale pm ON e.email = pm.email_elev
LEFT JOIN materiale m ON pm.id_mat = m.id AND m.id_curs = 18
WHERE e.email IN (
    SELECT email_elev FROM participanti WHERE id_curs = 18
)
GROUP BY e.nume

WITH total_materiale AS (
  SELECT COUNT(*) AS total FROM materiale WHERE id_curs = 18
),
total_completate AS (
  SELECT 
    p.email_elev, 
    COUNT(*) AS completate
  FROM materiale m
  LEFT JOIN progres_materiale p ON m.id = p.id_mat
  WHERE m.id_curs = 18
  GROUP BY p.email_elev
)
SELECT 
  tc.email_elev,
  tm.total AS total_materiale,
  tc.completate AS total_completate,
  ROUND((tc.completate * 100.0) / NULLIF(tm.total, 0), 2) AS procent
FROM total_completate tc
CROSS JOIN total_materiale tm


WITH total_materiale AS (
  SELECT COUNT(*) AS total FROM materiale WHERE id_curs = 18
),
completari AS (
  SELECT 
    p.email_elev, 
    COUNT(*) AS completate
  FROM progres_materiale p
  JOIN materiale m ON p.id_mat = m.id
  WHERE m.id_curs = 18
  GROUP BY p.email_elev
)
SELECT 
  e.nume,
  e.email AS email_elev,
  COALESCE(c.completate, 0) AS total_completate,
  tm.total AS total_materiale,
  ROUND((COALESCE(c.completate, 0) * 100.0) / NULLIF(tm.total, 0), 2) AS procent
FROM participanti p
JOIN elevi e ON e.email = p.email_elev
LEFT JOIN completari c ON c.email_elev = e.email
CROSS JOIN total_materiale tm
WHERE p.id_curs = 18


SELECT 
  e.nume,
  e.email AS email_elev,
  COUNT(CASE WHEN m.id_curs = 13 THEN pm.id_mat END) AS total_completate,
  (SELECT COUNT(*) FROM materiale WHERE id_curs = 13) AS total_materiale,
  ROUND(
    (COUNT(CASE WHEN m.id_curs = 13 THEN pm.id_mat END) * 100.0) / 
    NULLIF((SELECT COUNT(*) FROM materiale WHERE id_curs = 13), 0), 2
  ) AS procent
FROM participanti p
JOIN elevi e ON p.email_participant = e.email
LEFT JOIN progres_materiale pm ON pm.email_elev = e.email
LEFT JOIN materiale m ON pm.id_mat = m.id
WHERE p.id_curs = 13
GROUP BY e.email, e.nume;

    SELECT c.titlu, c.id, c.cost* count(p.email_participant) venit, count(p.email_participant) elevi
      FROM participanti p
        JOIN cursuri c ON c.id = p.id_curs
        WHERE c.email_profesor = 'cosmina@gmail.com'
        group by id, titlu
        order by venit desc
        limit 3

SELECT c.id, c.titlu, c.cost, c.cale_poza, p.nume FROM cursuri c JOIN profesori p ON c.email_profesor = p.email

SELECT c.id, c.titlu, c.cost, c.cale_poza, p.nume FROM cursuri c JOIN profesori p ON c.email_profesor = p.email_participant