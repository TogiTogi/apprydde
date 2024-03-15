
insert into task (name, description, points) values ('Vaske bad', 'Dusj, toalett, servant og gulv', 60),
('Vaske gangen', 'Husk å rydde unne sko og annet rot', 30),
 ('Rydde etter middag', 'Vaske stekepanne, sette inn i oppvaskmaskin, vaske av bordet, vaske komfyr og benkeplate', 45), 
 ('Støvsuge soverommene', 'Husk å støvsuge undre sengen', 20), 
 ('Støvsuge kjøkken/stue', 'Husk å støvsuge under sofa og bord', 30), 
 ('Skifte sengetøy', 'Legge det gamle i skittentøyey', 20), 
 ('Lage middag', 'Husk å rydde opp etter deg', 40), 
 ('Handle', 'Sjekk handlelisten', 60);


insert into role (name) values ('Administrator'), ('Forelder'), ('Barn');

insert into user (firstname, lastname, username, password, birthDate, idRole) values ('Ola', 'Nordmann', 'Oldis', 'Oldis', '1976-01-01', 2), 
('Kari', 'Nordmann', 'Kardis', 'Kardis', '2000-01-01', 2), 
('Admin', 'Adminsen', 'Admin', 'Admin', '2000-01-01', 1),
('Sturla', 'Nordmann', 'Lilleputt', 'Lilleputt', '2011-01-01', 3),
('Anna', 'Nordmann', 'Anna', 'Anna', '2009-01-01', 3);

insert into done (idTask, idUser, comment) values (1, 1, null), 
(2, 1, null), 
(3, 2, null), (4, 1, null), (5, 1, null), (6, 1, null), 
(7, 1, null), (8, 1, null), (1, 2, null), 
(2, 2, null), (3, 4, null), (4, 4, null), (5, 5, null), (6, 5, null);