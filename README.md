# Storefront Backend
The storefront backend project aims to supply the storefront application with a REST API connected to a Postgres database ready to use by our frontend team.

## System components

### Postgres Database
- **Version** : *14.1*

#### Installation steps:

##### Production:
- CREATE USER shopping_user WITH PASSWORD 'password123';
- CREATE DATABASE shopping;
- \c shopping
- GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;
##### Test:
- CREATE DATABASE shopping_test;
- \c shopping_test
- GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;

### Node/Express API:
- **Version**: Node v16.13.1
- **Port**: 3000
- **Application Admin**: *Please provide adminuser data to the related environment variabels*

#### Installation steps:
- **npm install**: *Install all packages*
- **db-migrate up**: *run database migrations*

#### Environment Variables (Please add a .env file to the project folder and add the following variables)
- **PG_USER**: *database users*
- **PG_PASSWORD**: *database user password*
- **PG_DATABASE**: *database name*
- **PG_DATABASE_TEST**: *test database name*
- **PG_HOST**: *database host IP or URL*
- **PG_PORT**: *5432*
- **JWT_SECRET**: *jwt secret*
- **SUPERADMIN_USERNAME**: *Enter your application's superadmin username*
- **SUPERADMIN_PASSWORD**: *Enter your application's superadmin password*
- **SUPERADMIN_FIRSTNAME**: *Enter superadmin's firstname*
- **SUPERADMIN_LASTNAME**: *Enter Superadmin's lastname*
- **ENV**: *test or dev*

#### Commands:
- **npm run test**: *build and run unit tests*
- **npm run start**: *build and start server*
