# Initial NodeJS project with Express + TypeOrm + Typescript

## Features

### Middleware

Middleware authentication with JWT and check permissions by route

### Controllers

Controllers to connect and request information from BD

### TypeOrm

Type Orm is a famous ORM in NodeJs to works easily with different BDs

### Environments

It has setup scripts with different environments if your works in local or you need deploy in different environments

### Authentication

Create users with hash password with https://www.npmjs.com/package/argon2 encryption and JWT authentication to manage HTTP request easily.

## Setup TypeOrm:

This project as default is configured with postgreSql bd, but if you want you can change bd and works with others BDs.
See the official documentation to change bd https://typeorm.io/#/

## Setup postgresql:

1. Go to official website and download the last version of db
2. Create new database
3. Change variables connection in .env file to connect in your local db
4. Run migrations to create tables `yarn typeorm migration:run`

## Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `ormconfig.json` file
3. Run in develop `yarn dev` command
