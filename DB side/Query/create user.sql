-- User: app_user
-- DROP USER app_user;

CREATE USER app_user WITH
  LOGIN
  NOSUPERUSER
  NOINHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

GRANT postgres TO app_user;