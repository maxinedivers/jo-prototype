var util = require('util');

var Base = require('./form'),
    orCountries = require('../config/or-overseas-countries');

var Controller = function Controller(options) {
    if (!options.nextAlt) {
        throw new Error('`options.nextAlt` should be specified');
    }
    Base.call(this, options);
};

util.inherits(Controller, Base);

Controller.prototype.successHandler = function successHandler(req, res, callback) {
    if (req.sessionModel.get('application-country') && orCountries.indexOf(req.sessionModel.get('application-country')) > -1) {
        return res.redirect(this.options.nextAlt);
    }
    Base.prototype.successHandler.call(this, req, res, callback);
};

module.exports = Controller;