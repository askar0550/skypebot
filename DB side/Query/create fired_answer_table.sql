-- Table: app_test.fired_answer

-- DROP TABLE app_test.fired_answer;

CREATE TABLE app_test.fired_answer
(
    id serial,
	convid text COLLATE pg_catalog."default",
	username text COLLATE pg_catalog."default",
	userid text COLLATE pg_catalog."default",
    qid integer,
	fqid integer,
	choises text COLLATE pg_catalog."default",
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE app_test.fired_answer
    OWNER to postgres;

GRANT SELECT ON TABLE app_test.fired_answer TO app_user;
GRANT INSERT ON TABLE app_test.fired_answer TO app_user;

GRANT ALL ON TABLE app_test.fired_answer TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_test TO app_user;

