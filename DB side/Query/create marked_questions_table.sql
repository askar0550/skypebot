-- Table: app_test.question

-- DROP TABLE app_test.question;

CREATE TABLE app_test.complaints
(
    id serial,
	convid text COLLATE pg_catalog."default",
	username text COLLATE pg_catalog."default",
	userid text COLLATE pg_catalog."default",
	tmstamp timestamp,
    qid integer,
    complaint text COLLATE pg_catalog."default",
    CONSTRAINT qid_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE app_test.complaints
    OWNER to postgres;

GRANT SELECT ON TABLE app_test.complaints TO app_user;
GRANT INSERT ON TABLE app_test.complaints TO app_user;

GRANT ALL ON TABLE app_test.complaints TO postgres;