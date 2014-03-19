var rest = require('restler')
 _ = require('underscore');

var realEndpoint = 'https://api.payjunction.com';
var testEndpoint = 'https://api.payjunctionlabs.com';

PayJunctionClient = rest.service(function(options) {
  // maybe we should validate these parameters exist
  this.baseURL = options.endpoint;
  this.defaults.username = options.username;
  this.defaults.password = options.password;
  this.defaults.headers = {
    'X-PJ-Application-Key': options.appkey
  };
}, {}, {

  customerCreate: function(params) {
    return this.post('/customers', {
      data: params
    });
  },

  customerGet: function(id) {
    return this.get('/customers/' + id);
  },

  customerUpdate: function(params) {
    params = _.extend({}, params);
    var id = params.id;
    delete params.id;

    return this.put('/customers/' + id, {
      data: params
    });
  },

  customerDelete: function(id) {
    return this.del('/customers/' + id);
  }
});

module.exports = PayJunctionClient;
