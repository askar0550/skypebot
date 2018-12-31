-- SCHEMA: app_test

-- DROP SCHEMA app_test ;

CREATE SCHEMA app_test
    AUTHORIZATION postgres;

GRANT ALL ON SCHEMA app_test TO postgres;

GRANT ALL ON SCHEMA app_test TO app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA app_test
GRANT SELECT ON TABLES TO app_user;