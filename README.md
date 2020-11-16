# README #
This README document will provide steps to get this application up and running.

### Basic steps ###
- `Create .env file`
  - `To run the project in docker >> copy` docker_env `to .env`
  - `To run the project in local >> copy` local_env `to .env`
- `Create private_key.txt file and copy sample_private_key.txt to that file`
- `Run 'npm install' or 'npm i'` (within the directory)
- `To start the project :`
  - `In local >> type the command in terminal 'npm start' or 'npm run dev'`
  - `In docker >> type the command in terminal 'docker-compose up'`
- `By default, the server will start on port 5000`
- `To access swagger documentation open` [http://localhost:5000/v1/api-docs/](http://localhost:5000/v1/api-docs/)

### Run tests ###

- `Run 'npm run test'` (within the directory)

### Configurations ###

- Database configurations in `./config/database.js`
- Swagger configuration in `./config/swagger.js`

### Files ###

- `private_key.txt` > for password hashing
- `.env` > for environment variables

### Docker ###

- Containers :
  - Nodejs server :
    - container name  = `nodejs_server`
    - port            = `5000`
  - MongoDB :
    - container name  = `mongo`
    - port            = `27017`

### Third-party libraries and usage ###

#### Dependencies ####

* `bcrypt`              - Password-hashing
* `body-parser`         - Node.js body parsing middleware
* `dotenv`              - Loads environment variables from a . env file into process. env
* `jsonwebtoken`        - JSON Web Token implementation
* `module-alias`        - Create aliases of directories and register custom module paths
* `mongoose`            - Mongodb schema solution
* `swagger-jsdoc`       - Generates swagger doc based on JSDoc
* `swagger-ui-express`  - Auto-generated swagger-ui

#### Dev-Dependencies ####

* `babel-eslint`  - Linting utility
* `eslint`        - Linting utility
* `nodemon`       - Automatically restarting the node application when file changes
* `jest`          - Unit testing
* `supertest`     - Unit testing