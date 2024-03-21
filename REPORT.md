# Project Report

## Difficulties and unforeseen Issues

### Docker-Compose Startup Issue

I had to update node version to 14.16-alpine because when the uild got to
`yarn global add serve`, it complained of node version 12 being outdated

`error boxen@7.0.0: The engine "node" is incompatible with this module. Expected version ">=14.16". Got "12.20.1"`

### Dockerfile Misconfiguration

Starting the project was a hassle. There was a misconfiguration in the Docker Compose file for the frontend. It was exposing port 3000 with the code

`EXPOSE 3000`

THis was an issue as the client server was also configured to be listening on the same port as the server which made the frontend unable to be accessed, I switched this port to 5000 and added additional command to CMD which becomes

`CMD ["serve", "-s", "build", "-l", "5000"]`

This serves the build folder as before but the client now listens on port 5000, as expected

### Running user.spec.ts File

I opted to run user.spec.ts file by locally connecting to my postgres database as oppossed to running it in docker. This was because of issue related to my windows machine with the docker socket file. Even after mounting the docker socket from my host machine to the same location in the backend container, they still couldn't communicate.
I binded it with

`/var/run/docker.sock:/var/run/docker.sock`

I knew if I kept trying to fix this issue I'll run out of time and not be able to complete the challenge this was why I opted for a local setup which as a result made me modify the database file.

In docker, running all other tests passes except the user.spec.ts file

If I had enough time, I would have figured out how to resolve the socket issue and run the tests as expected.
This is the result of me running it locally

## Test Results

PASS test/user.spec.js (5.646 s)

GET /users/me 200 801 - 1413.607 ms

PUT /users/me 400 43 - 2.097 ms

PUT /users/me 200 135 - 16.246 ms

PASS src/user/milestones/authentication.spec.js

PASS src/user/milestones/authorization.spec.js

PASS src/user/milestones/presentation.spec.js

| File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files           | 91.4    | 77.78    | 92.86   | 92.39   |                   |
| src                 | 0       | 100      | 100     | 0       |                   |
| config.js           | 0       | 100      | 100     | 0       | 3-5               |
| src/database        | 100     | 100      | 100     | 100     |                   |
| index.js            | 100     | 100      | 100     | 100     |                   |
| src/server          | 94.44   | 50       | 100     | 100     |                   |
| index.js            | 94.44   | 50       | 100     | 100     | 19                |
| src/server/loaders  | 100     | 100      | 100     | 100     |                   |
| middlewares.js      | 100     | 100      | 100     | 100     |                   |
| resources.js        | 100     | 100      | 100     | 100     |                   |
| src/user            | 100     | 100      | 100     | 100     |                   |
| index.js            | 100     | 100      | 100     | 100     |                   |
| model.js            | 100     | 100      | 100     | 100     |                   |
| src/user/milestones | 88.64   | 81.25    | 83.33   | 88.64   |                   |
| authentication.js   | 88.24   | 80       | 100     | 88.24   | 27,32             |
| authorization.js    | 100     | 100      | 100     | 100     |                   |
| index.js            | 100     | 100      | 100     | 100     |                   |
| presentation.js     | 80      | 75       | 75      | 80      | 21,31-32          |

Test Suites: 4 passed, 4 total

Tests: 18 passed, 18 total

Snapshots: 0 total

Time: 6.608 s, estimated 8 s

## General Comments

- authentication, authorization and presentation files are well documented
- in presentation, I chose to use map as opposed to forEach or traditional for loop because I considered performance. For loop would have fetched character details one after the other as opposed to map and promise,all which fetches at at the same time

## Future Improvements

- **Pagination**: If the list of favourites characters becomes large, fetching all of them at once might be ineffective so,I could add pagination to the get request

- **Search**: I cold add search feature that allows users to search their favourite characters

- **Caching**: To improve performance, I could cache the result from SWAPI api calls, this will reduce the number of calls to SWAPI and speed up the API

- **Additional Tests**: to cover edge cases and unrecognized inputs
