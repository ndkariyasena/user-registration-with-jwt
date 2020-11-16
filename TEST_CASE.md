# Selection Test for Software Engineers - NodeJS #

## Duration - 4-8hrs ##

Note​ - You can use internet resources, only to follow documentation of third-party libraries,
by any chance do not use third-party code segments for this test. Please follow and maintain
good code quality and standards.
Problem

Your assignment will be to create a simple RESTful API using NodeJS. Requirements are
explained below and it is expected to install and configure the development environment on
your own. Readme file with steps to set up and execute your project is expected along with
the source code as the output from this test. You are free to use standard Docker images for
things like NodeJS & MongoDB runtimes.

## Technology ##
* ### `Backend` ###
  * NodeJS (Express)
  * JWT - ​ https://jwt.io/
  * MongoDB
  
## Tasks ##
* ### `Database` ###
  * Use MongoDB for storing user accounts.
  * Provide necessary scripts to initialize/restore the database
* ### `API` ###
  * Create a user registration API with the below endpoints
    * `/register` (assume the account is activated upon registration)
    * `/login`
    * `/logout`
  * Use JWT for authentication (Use any library you prefer)
  * Create an endpoint to view user registration details - /profile
    * Only logged in users should be able to access this endpoint
    * Only his information should be able to view
  * Use environment variables to store configuration parameters

* ### `Test Cases` ###
  * Write test cases to test all 4 endpoints
  * Include steps to execute these tests in the Readme file

### `Plus points` ###
* Containerize your application and provide a Docker file.
* Always follow best practices