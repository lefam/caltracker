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

    return router;
};