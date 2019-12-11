# Tracking application for cryptocurrency custodianship
This application can be used to track cryptocurrency wallets (bitcoin and ether). 

## Getting Started


### Prerequisites 
The following software should be installed in your development environment before using this repository:

1. Node JS (^12.13.0)
2. Node Package Manager (npm) (^6.12.0)
3. Docker (^19.03.2)

### Installing 

Clone the repository with the following command: 

`git clone https://github.com/unicef/gilgamesh-track`

Once the repository is cloned, there are two folders. One is for the client app and the other is for the server app.

### Client

The client application is a React JS application.

For local development, the following steps must take place:

1. Change into the directory of the client app `cd client`
2. Install the packages that are associated with the client app `npm install`
3. Start the application `npm start`
4. The files that are relevant to the application are stored in the `/src` folder. Update these files to update the application


### Server

The server application is a Node JS application that is written in TypeScript and GraphQL.

For local development, the following steps must take place:

1. Change into the directory of the server app `cd server`
2. Install the packages that are associated with the client app `npm install`
3. Start the application `npm start`
4. The files that are relevant to the application are stored in the `/src` folder. Update these files to update the application


Other notes: 
- The application is using Apollo GraphQL

## Deployment
Each application within this folder (client, server) is containerized with Docker.
## Built with 

### Client 
- React JS

### Server
- Node JS
- Typescript
- GraphQL

## Contributing
There are four major branches for this repository: 

1. Master - releases are created from this
2. Staging - UAT 
3. Testing - Integration / feature testing
4. Development - Latest code that is being worked on

To contribute to this application, create a branch from the Development branch. The format of the branch name should be: 

> <NUMBER OF THE CARD YOU ARE WORKING ON>-<SHORT DESCRIPTION> (e.g. 12-adding-graphql)

Once your update is complete, submit a pull request to the Development branch. 

## Authors
Mehran Hydary (mhydary@unicef.org)