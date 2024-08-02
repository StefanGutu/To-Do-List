CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL
);

-- docker cp postgres-init/toDoList.sql my_postgres_container:/toDoList.sql
-- docker exec -it my_postgres_container psql -U postgres -d postgres -f /toDoList.sql