var express = require('express'),
    router = express.Router(),
    fs = require('fs');

module.exports = function(config, models) {
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file !== 'index.js') {
            var moduleName = file.split('.')[0];
            router.use("/" + moduleName, require("./" + moduleName)(config, models));
        }
    });

    router.get('/me', function(req, res) {
        // The API middleware protects this endpoint and makes sure that the req.user is populated
        // with the owner of the auth token.
        res.json(req.user);
    });

    return router;
};