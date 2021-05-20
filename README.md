# World Data Mapper

## VIP Application Platform


#### Overview . . . . . . . . . . . . . . . . . . . .
The VIP Application Platform is primarily built using the Apollo Platform, specifically Apollo Client and Apollo Server. The subject of this document is an example application intended to serve as a rough guide for the structure of future applications utilizing the platform. The below sections go into detail about the constituent parts of the client and server domains of the application. Additionally, there are links to the documentation of the technologies used at the end of platform description; it\'s strongly advised to read them, particularly the docs relating to the Apollo Platform and GraphQL.

#### Getting Started. . . . . . . . . . . . . . . . .
Before working with the todo-list prototype application, make sure Node.js is installed on your machine (https://nodejs.org/en/). To get started with the platform either clone or download the zip of the git repository: https://github.com/charliemonnone/TodoTracker. If you don\'t have access, mention it in the VIP Slack channel and someone will add you. In the TodoTracker folder complete the following steps:
* Run git switch local-build to switch to the development branch intended for local use.
* In the root directory (TodoTracker/) run npm install
* Go to the client directory(TodoTracker/client) using cd client and run  npm install again.
* Return to the root directory using cd ..

You now have everything you need to start the application, and there are two options for starting the application:

* Run npm start in the root directory
* Run nodemon in the root directory and npm start in the client directory

Generally option 1 is the preferred method as it is more convenient than manually running two separate scripts, but depending on what you’re working on, having both the front and back end servers running may be unnecessary.

