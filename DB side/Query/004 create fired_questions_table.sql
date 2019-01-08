CREATE TABLE :schema_name.fired_question
(
    id serial,
	convid text COLLATE pg_catalog."default",
    qid integer,
	tmstamp timestamp,
	complete boolean,
    PRIMARY KEY (id)
)