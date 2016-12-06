

#Required
-nodejs version 4.4.1 or higher

#NPM Packages
express: ^4.10.6

mysql: ^2.5.4

body-parser: ^1.15.1

log4js: ^0.6.36

#Install
1.  Clone or download repo

2.  Run angulartest.sql in **schema** folder, preferably in PHPMyAdmin or command line.  This will create database and table.

3.	Run node create_user_table.js to create a table for the users in your db

4.  Edit **server.js** lines **40 & 41** with the username and password of the MySQL database.

5.  Via command line, change directory to project root and run **npm install**, this will install dependencies. 

6.  **nodemon server.js** to run application.

7.  Browse to http://localhost:8081
