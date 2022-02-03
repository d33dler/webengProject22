Efforts:\
The project was created in its entirety by Radu Rebeja.

Decisions:\
Initially, I created multiple endpoints to offer services which were too specific.
This resulted in a high number of weak endpoints which made our API a shallow service module.
This was changed in next iteration to offer much more powerful endpoints for CRUD operations.
The result was that endpoints were able to fulfill the project requirements and offer additional 
functionalities simply by offering more general (abstract) approach to database querying.
For this , a database query builder was required to parse HTTP queries into appropiate json object format
used by the Sequelize library which offers programmatic querying functions.
It was decided to include javascript sets to allow the backend to be scalable and
flexible. Now we can add a multitude of databases alongside javascript files 
and profit from a re-usable backend.
It was decided to deploy the frontend statically in order to 
allow functionality evaluation by supervisors due to OS differences.'




