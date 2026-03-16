
## Build a basic version of PayTM

#### Docker Setup for local MongoDB

- Build docker image for local Mongodb database using ``` docker build ./ -t mongodb:4.7-replset ``` 
- Then run the docker container using - ``` docker run --name mongodb-replset -p 27017:27017 -d mongodb:4.7-replset ```