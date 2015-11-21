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

In this section I present the steps that you must follow to prepare the app to run it locally. The app is also 
available at https://whispering-fjord-4404.herokuapp.com

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
(this is needed because we do not version control node modules):

```
npm install
```

Finally you can start the app. Please make sure that MongoDB is running and run the following command:

```
npm start
```

Now the app will be running at http://localhost:4001

## Running tests

The following commands are available to run tests:
- `npm run test-api` --> to run API functional tests
- `npm run test-api-cov` --> to run API functional tests and produce coverage reports (saved at ./coverage)

## Deploying to Heroku

The app is prepared to be easily deployed to [Heroku](http://heroku.com). To deploy create a Heroku app and repository
and push the code with `git push heroku master`. Heroku will install all the necessary tools and modules and run the
gulp tasks.

Before you use the app you will need to set the vars (`NPM_CONFIG_PRODUCTION`, `DATABASE_URL` and `TOKEN_SIGN_SECRET`).

- NPM_CONFIG_PRODUCTION should be false
- DATABASE_URL should point to your MongoDB database url
- TOKEN_SIGN_SECRET should be a secret phrase and is used to sign and verify JWT tokens.

Eg:

```
heroku config:set NPM_CONFIG_PRODUCTION=false
herou config:set DATABASE_URL=mongodb://user:password@yourserver.com
heroku config:set TOKEN_SIGN_SECRET=mysecret_token
```

You can use the Heroku MongoLab addon to create a free MongoDB database.