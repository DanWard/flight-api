# Flight-API

## APIs
### `GET /flights?airline=XYZ`
This API will return with the following syntax:
```
{
    "flights": Array of flights,
    "size": Total results provided (can be expanded for pagination),
    "status": HTTP status code
}
```
The optional query parameter `airline` is included to filter the dataset returned from the database.

### `POST /flights`
This API will return with the following syntax:
```
{
    "flight": The database object of the POSTed data,
    "status": HTTP status code
}
```

## Running
### Development
To run nodemon (which watches the filesystem for any changes and restarts the dev server), please run:
```
npm run watch
```

### Compiling
To view and produce a transpiled output, please run the following:
```
npm run build
```
### Starting the webserver
For normal scenarios and debugging, running the following will start the webserver and database:
```
npm start
```

## Tests
Test cases have been provided and can be run by using:
```
npm test
```
The tests provided have 100% coverage of the APIs through blackbox integration testing. Jest acts as the unit test provider and supertest provides the integration layer. Each test is designed to cover cases that the API may be exposed to in a production environment.


## Productionizing
The included database provider (LokiJS) is not part of the target architecture. This instead would be swapped out for a proper hosted persistent database provider, e.g. MongoDB.
The ExpressJS layer has been designed to run in a lightweight serverless execution environment, like AWS Lambda.

### Design
As this application has only a single function, a simple deployment can be considered.
![Production Design](https://github.com/DanWard/flight-api/raw/master/production.png)

## Security
Cyber security standards have also been considered and this application is shipped with multiple different protection mechanisms that are available when run in the production mode.
* CSRF
* X-frame 
* P3P
* HSTS
* XSS
* Frame sniffing
* Referral policy

### Considerations
In a production environment, the `POST` request should be guarded against unauthenticated calls to ensure that the data quality is not degraded in any way due to accidental or purposeful data pollution.