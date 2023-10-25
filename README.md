# Simple online tic-tac-toe application

This is a personal project for proof of concept.

## How to launch

Run the server, then the client application. Open a browser at the configured url (localhost:3000 if no changes were made) to view the application locally.
You can open another session in another windows in incognito mode to simulate a second player.

Each player has to enter the same room id to start playing together. Once that is done, the game starts.

When the party is over, any player can click on the Replay button to play another game.


## Available Scripts

In the project directory, there is a server project in Node.js and a client one in React

### Server

In the server directory, you can run :

#### `npm start`

Runs the server in the development mode on localhost port 9000.

### Client

In the client directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
