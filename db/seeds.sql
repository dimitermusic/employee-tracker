INSERT INTO
    department (name)
VALUES
    ("Management"),
    ("Sales"),
    ("Human Resources"),
    ("Operations");

INSERT INTO
    role (title, salary, department_id)
VALUES
    ("Manager", 100000, 1),
    ("Engineer", 80000, 2),
    ("Intern", 40000, 3);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Dimiter", "Yordanov", 1, NULL),
    ("Bob", "Jones", 2, 1),
    ("Jill", "Evans", 3, 1);