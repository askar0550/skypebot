-- Table: app_test.question

DROP TABLE app_test.question;

CREATE TABLE app_test.question
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
	firedcounter integer default 0,
	ansOKcounter integer default 0,
	ansTOUTcounter integer default 0,
    CONSTRAINT question_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE app_test.question
    OWNER to postgres;

GRANT SELECT ON TABLE app_test.question TO app_user;

GRANT ALL ON TABLE app_test.question TO postgres;