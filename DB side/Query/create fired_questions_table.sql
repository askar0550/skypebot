-- Table: app_test.fired_question

-- DROP TABLE app_test.fired_question;

CREATE TABLE app_test.fired_question
(
    id serial,
	convid text COLLATE pg_catalog."default",
    qid integer,
	tmstamp timestamp,
	complete boolean,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE app_test.fired_question
    OWNER to postgres;

GRANT SELECT ON TABLE app_test.fired_question TO app_user;
GRANT INSERT ON TABLE app_test.fired_question TO app_user;

GRANT ALL ON TABLE app_test.fired_question TO postgres;

