# Leonel Machava Project Aka CalTracker
Hi.

This is the CalTracker project, an application that helps you control your meals and calories.

I am using the MEAN stack (MongoDB + Express.js + Angular + Node.js).

The following tools are essential to contribute to the development of this project:
- Bower to manage front end components.
- Gulp to run tasks such as CSS and JS minifying and building the final package.
- NPM to manage Node packages (tools and libraries).
- Mocha is one the test frameworks used.
- Istanbul to produce test coverages and reports for mocha based tests.
- Protractor for E2E tests.

## Running the app

Please make sure that you have [Node.js](http://nodejs.org) and NPM installed.

After that please install the following tools:

```
npm install gulp -g
npm install bower -g
npm install mocha -g
npm install istanbul -g
npm install protractor -g
```

After you finish installing the above tools, please run the following command to install the app modules 
(this is needed becuse we do not version control node modules):

```
npm install
```

Finally you can start the app by running:

```
npm start
```

Now the app will be running at http://localhost:4001
