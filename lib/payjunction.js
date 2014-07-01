var rest = require('restler');
var _ = require('underscore');
var packageVersion = require('package.json').version;

var liveEndpoint = 'https://api.payjunction.com';
var testEndpoint = 'https://api.payjunctionlabs.com';
var userAgent = 'PayJunctionNodeClient/' +
  packageVersion + ' (BrandedCrate; NodeJs/' +
  process.version + ')';

var generateClient = function(definition){
  var serviceInit = function(options){
    this.baseURL = options.endpoint;
    this.defaults.username = options.username;
    this.defaults.password = options.password;
    this.defaults.headers = {
      'X-PJ-Application-Key': options.appkey,
      'User-Agent': userAgent
    };
  };

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

  update: function(id, params) {
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

  update: function(id, params) {
    return this.put('/transactions/' + id, {
      data: params
    });
  },

  addSignature: function(id, params) {
    return this.post('/transactions/' + id + '/signature/capture', {
      data: params
    });
  }
});

var ReceiptClient = generateClient({
  read: function(transactionId, params) {
    return this.get('/transactions/' + transactionId + '/receipts/latest', {
      data: params
    });
  },

  readThermal: function(transactionId, params) {
    return this.get('/transactions/' + transactionId + '/receipts/latest/thermal', {
      data: params
    });
  },

  readFullpage: function(transactionId, params) {
    return this.get('/transactions/' + transactionId + '/receipts/latest/fullpage', {
      data: params
    });
  },

  email: function(transactionId, params) {
    return this.post('/transactions/' + transactionId + '/receipts/latest/email', {
      data: params
    });
  }
});

var setEndpoint = function(options){
  if (typeof options.endpoint === 'undefined') {
    throw new Error('You must specify the endpoint (usually \'live\' or \'test\')');
  }

  if (options.endpoint === 'test') {
    options.endpoint = testEndpoint;
  }

  if (options.endpoint === 'live') {
    options.endpoint = liveEndpoint;
  }
};

var PayJunctionClient = function(options){
  options = _.extend({}, options);

  setEndpoint(options);

  options.username;
  options.password;

  this.customer = new CustomerClient(options);
  this.transaction = new TransactionClient(options);
  this.receipt = new ReceiptClient(options);
};

module.exports = PayJunctionClient;
