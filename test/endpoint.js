var PayjunctionClient = require('./../lib/payjunction'),
    assert = require('assert');

var assert = require("assert")
describe('transactions', function(){
  it('uses the endpoint you provide', function(){
    var payjunction = new PayjunctionClient({
      username: '1',
      password: '2',
      appkey: 'mykey',
      endpoint: 'http://localhost:3000'
    });

    assert.equal(payjunction.customer.baseURL, 'http://localhost:3000');
  });

  it('complains if you do not provide one', function(){
    var clientCreator = function(){
      new PayjunctionClient({
        username: '1',
        password: '2',
        appkey: 'mykey',
      });
    };

    assert.throws(clientCreator, Error, "Error thrown");
  });

  it('allows shorthand test endpoint', function(){
    var payjunction = new PayjunctionClient({
      username: '1',
      password: '2',
      appkey: 'mykey',
      endpoint: 'test'
    });

    assert.equal(payjunction.customer.baseURL, 'https://api.payjunctionlabs.com');
  });

  it('allows shorthand live endpoint', function(){
    var payjunction = new PayjunctionClient({
      username: '1',
      password: '2',
      appkey: 'mykey',
      endpoint: 'live'
    });

    assert.equal(payjunction.customer.baseURL, 'https://api.payjunction.com');
  });
})

