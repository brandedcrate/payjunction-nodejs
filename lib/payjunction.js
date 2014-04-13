var rest = require('restler')
 _ = require('underscore');

var realEndpoint = 'https://api.payjunction.com';
var testEndpoint = 'https://api.payjunctionlabs.com';
var userAgent = 'BrandedCrate/PayJunctionNodeClient/0.1.0'

var serviceInit = function(options){
  // maybe we should validate these parameters exist
  this.baseURL = options.endpoint;
  this.defaults.username = options.username;
  this.defaults.password = options.password;
  this.defaults.headers = {
    'X-PJ-Application-Key': options.appkey,
    'User-Agent': userAgent
  };
};

var generateClient = function(definition){
  return rest.service(serviceInit, {}, definition);
};

var CustomerClient = generateClient({
  create: function(params) {
    return this.post('/customers', {
      data: params
    });
  },

  read: function(id) {
    return this.get('/customers/' + id);
  },

  update: function(params) {
    params = _.extend({}, params);
    var id = params.id;
    delete params.id;

    return this.put('/customers/' + id, {
      data: params
    });
  },

  delete: function(id) {
    return this.del('/customers/' + id);
  }
});

var TransactionClient = generateClient({
  create: function(params) {
    return this.post('/transactions', {
      data: params
    });
  },

  read: function(id) {
    return this.get('/transactions/' + id);
  },

  update: function(params) {
    params = _.extend({}, params);
    var id = params.id;
    delete params.id;

    return this.put('/transactions/' + id, {
      data: params
    });
  }
});

var PayJunctionClient = function(options){
  // maybe we should validate these parameters exist
  this.baseURL = options.endpoint;
  this.username = options.username;
  this.password = options.password;
  this.headers = {
    'X-PJ-Application-Key': options.appkey
  };

  this.customer = new CustomerClient(options);
  this.transaction = new TransactionClient(options);
};

module.exports = PayJunctionClient;
