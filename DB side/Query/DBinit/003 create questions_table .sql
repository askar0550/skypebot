CREATE TABLE main.question
(
    id serial,
    questionnr integer,
    question text COLLATE pg_catalog."default",
    ansa text COLLATE pg_catalog."default",
    ansb text COLLATE pg_catalog."default",
    ansc text COLLATE pg_catalog."default",
    ansd text COLLATE pg_catalog."default",
    anse text COLLATE pg_catalog."default",
    ansf text COLLATE pg_catalog."default",
    ansg text COLLATE pg_catalog."default",
    answer text COLLATE pg_catalog."default",
    explanation text COLLATE pg_catalog."default",
    CONSTRAINT question_pkey PRIMARY KEY (id)
)