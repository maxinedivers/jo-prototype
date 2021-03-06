var util = require('util'),
  _ = require('underscore'),
  moment = require('moment');

var SessionForm = require('./form'),
  CostModel = require('../models/costs');

var ConfirmForm = function(options) {
  SessionForm.call(this, options);
};

util.inherits(ConfirmForm, SessionForm);

function join(obj, keys, separator) {
  separator = separator || ' ';
  return _.chain(obj).pick(keys).filter(_.identity).value().join(separator);
}

function currency(cost) {
  cost = cost % 1 ? cost.toFixed(2) : cost;
  return '£' + cost;
}

// find the path for the step containing a given field
ConfirmForm.prototype.getEditStep = function(field) {
  var step = _.find(Object.keys(this.options.steps), function(path) {
    var s = this.options.steps[path];
    return s.fields && s.fields.indexOf(field) > -1;
  }, this);
  if (step == '/address') {
    step += '-manual';
  }
  return step && (step + '/edit');
};

ConfirmForm.prototype.getValues = function(req, res, callback) {
  SessionForm.prototype.getValues.call(this, req, res, function(err, values) {
    if (err) {
      callback(err);
    } else {
      this.createBreakdown(req, values, callback);
    }
  }.bind(this));
};

ConfirmForm.prototype.createBreakdown = function(req, values, callback) {
  var model = new CostModel();
  model.set(values);
  var response = _.extend({}, values, {
    sections: []
  });

  var oldPassportFields = [];
  oldPassportFields.push({
    step: this.getEditStep('passport-number'),
    title: 'Passport number',
    value: values['passport-number']
  }, {
    step: this.getEditStep('expiry-year'),
    title: 'Expiry date',
    value: moment(values['expiry-year'] + '-' + values['expiry-month'] + '-01', 'YYYY-MM-DD').format('MMMM YYYY')
  });

  if (values['what-damaged']) {
    oldPassportFields.push({
      step: this.getEditStep('what-damaged'),
      title: 'What is damaged on your passport?',
      value: values['what-damaged']
    });
  };

  if (values['how-damaged']) {
    oldPassportFields.push({
      step: this.getEditStep('how-damaged'),
      title: 'How is your passport damaged?',
      value: values['how-damaged']
    });
  };

  response.sections.push({
    className: 'old-passport-details',
    title: 'Old passport',
    fields: oldPassportFields
  });

  var newPassportFields = [];
  var allPreviousNames = _.zip(values['previous-first-name'],values['previous-last-name']);
  var previousNamesList = "";
  for (i = 0; i < allPreviousNames.length; i++) {
  	previousNamesList += allPreviousNames[i].join(' ') + "<br>";
	}

  newPassportFields.push({
    step: this.getEditStep('name'),
    title: 'Title',
    value: values['title']
    //  value: values['title'] === 'Other' ? values['other-title'] : values['title']
  }, {
    step: this.getEditStep('name'),
    title: 'Name',
    value: join(values, ['name', 'lastname'])
  });

  if (values['change-name'] == true) {
    var str = values['change-of-name-reason'];
    reason = str.replace(/-/g, ' ');
    newPassportFields.push({
      step: this.getEditStep('change-of-name-reason'),
      title: 'Name change',
      value: reason
    });
  }

  newPassportFields.push({
    step: this.getEditStep('previous-first-name'),
    title: 'Previous names',
    value: values['previous-name'] ? previousNamesList : 'You have never been known by any other names'
  });

  newPassportFields.push({
      step: this.getEditStep('gender'),
      title: 'Gender',
      value: values['gender'] === 'M' ? 'Male' : values['gender'] === 'F' ? 'Female' : ''
    }, {
      step: this.getEditStep('age-year'),
      title: 'Date of birth',
      value: moment(values['age-year'] + '-' + values['age-month'] + '-' + values['age-day'], 'YYYY-MM-DD').format('D MMMM YYYY')
    }, {
      step: this.getEditStep('town-of-birth'),
      title: 'Town of birth',
      value: values['town-of-birth']
    }

  );

  if (values['country-of-birth']) {
    newPassportFields.push({
      step: this.getEditStep('country-of-birth'),
      title: 'Country of birth',
      value: values['country-of-birth']
    });
  }

  if (values['can-sign']) {
    newPassportFields.push({
      step: this.getEditStep('can-sign'),
      title: 'Signature',
      value: 'You&#39;ll sign your passport when you receive it.'
    });
  } else {
    newPassportFields.push({
      step: this.getEditStep('no-sign-reason'),
      title: 'Signature',
      value: values['no-sign-reason'] ? 'You can’t sign your passport:<br>' + values['no-sign-reason'] : 'You can’t sign your passport'
    });
  }

  newPassportFields.push(
    /*  {
          step: this.getEditStep('passport-details-correct'),
          title: 'Personal details',
          value: 'Your personal details haven’t changed'
      },*/
    {
      title: 'Your photo',
      custom: '<div class="photo"><img src="../../public/images/thumbnail.jpg" alt="Your uploaded photo" title="Your uploaded photo" width="150"></div>'
    }, {
      step: this.getEditStep('recognisable'),
      title: 'Your appearance',
      value: 'You can be recognised as the same person'
    }
  );

  response.sections.push({
    className: 'new-passport-details',
    title: 'New passport',
    fields: newPassportFields
  });

  response.sections.push({
    className: 'application-details',
    title: 'Application',
    fields: [{
        step: this.getEditStep('postcode'),
        title: 'Address',
        value: join(values, ['address1', 'address2', 'town', 'postcode'], '<br>')
      },
      {
        step: this.getEditStep('email'),
        title: 'Contact details',
        value: join(values, ['email', 'mobile'], '<br><br>')
      },
      {
        step: this.getEditStep('braille'),
        title: 'Braille',
        value: function() {
          var output = [];
          output.push(values['braille'] ? 'You require a braille sticker' : 'You don’t require a braille sticker');
          return output.join('<br><br>');
        }
      }
    ]
  });

  response.sections.push({
    className: 'cost-details',
    title: 'Cost',
    fields: [{
        step: this.getEditStep('braille'),
        title: 'New passport',
        value: function() {
          var output = [];
          if (values['passport-options'] == '48') {
            var cost = model.largePassport();
            cost = currency(cost);
            if (!values.veteran) {
              cost += '&nbsp;extra';
            }

            output.push('Jumbo passport with secure delivery included.');
            output.push('£85.50');
          } else {
            output.push('Standard passport with secure delivery included.');
            output.push('£72.50');
          }
          return output.join('<br>');
        }
      },
      {
        step: values.veteran ? null : this.getEditStep('secure-return'),
        title: values.veteran ? 'Delivery' : 'Old passport',
        value: function() {
          if (values['secure-return']) {
            var output = 'You need to post your old passport to us. We’ll return it to you by ';
            var cost = model.delivery();
            if (cost) {
              output += ' secure delivery. <br/>£3.00 ';
            }
            return output;
          } else {
            return 'You need to post your old passport to us. We’ll return it to you by standard post. <br/>£0.00';
          }
        }
      },
      {
        className: 'cost',
        title: 'Total',
        value: function() {
          return currency(values.cost);
        }
      }
    ]
  });
  callback(null, response);
};

module.exports = ConfirmForm;
