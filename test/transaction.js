var PayjunctionClient = require('./../lib/payjunction'),
    assert = require('assert'),
    bodyParser = require('body-parser'),
    express = require('express');

var assert = require("assert")
describe('transactions', function(){
  before(function(done){
    var app = express();

    app.use(bodyParser());

    var echo = function(req, res){
      res.send({
        headers: req.headers,
        path: req.path,
        requestBody: req.body
      });
    };

    app.post('*', echo);
    app.get('*', echo);
    app.put('*', echo);

    this.server = app.listen(3000);

    done();
  });

  var payjunction = new PayjunctionClient({
    username: 'pj-ql-01',
    password: 'pj-ql-01p',
    appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
    endpoint: 'http://localhost:3000'
  });

  describe('create', function(){
    beforeEach(function(done){
      this.transaction = payjunction.transaction.create({
        achRoutingNumber: 987654321,
        achAccountNumber: 123456789,
        achAccountType: 'CHECKING',
        foo: 'bar'
      });

      done();
    });

    it('posts data to /transactions', function(){
      this.transaction.on('complete', function(data){
        assert.deepEqual(data.requestBody, {
          achRoutingNumber: '987654321',
          achAccountNumber: '123456789',
          achAccountType: 'CHECKING',
          foo: 'bar'
        });
      });
    });

    it('posts to the right path', function(){
      this.transaction.on('complete', function(data){
        assert.equal(data.path, '/transactions');
      });
    });
  });

  describe('read', function(){
    it('gets from the right path', function(){
      this.transaction = payjunction.transaction.read({
        id: 543
      });

      this.transaction.on('complete', function(data){
        assert.equal(data.path, '/transactions/543');
      });
    });
  });

  describe('update', function(){
    beforeEach(function(done){
      this.transaction = payjunction.transaction.update({
        id: 654,
        foo: 'baz'
      });

      done();
    });

    it('passes the right data', function(){
      this.transaction.on('complete', function(data){
        assert.deepEqual(data.requestBody, {
          foo: 'baz'
        });
      });
    });

    it('puts to the right path', function(){
      this.transaction.on('complete', function(data){
        assert.deepEqual(data.path, '/transactions/654');
      });
    });
  });

  after(function(done){
    done();
  });
})

