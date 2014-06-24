var PayjunctionClient = require('./../lib/payjunction'),
    assert = require('assert'),
    server = require('./echo-server');

var assert = require("assert")
describe('transactions', function(){
  before(server.start);
  after(server.end);

  var payjunction = new PayjunctionClient({
    username: 'pj-ql-01',
    password: 'pj-ql-01p',
    appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
    endpoint: 'http://localhost:3000'
  });

  describe('create', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.transaction.create({
        achRoutingNumber: 987654321,
        achAccountNumber: 123456789,
        achAccountType: 'CHECKING',
        foo: 'bar'
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('passes the right data', function(){
      assert.deepEqual(this.data.requestBody, {
        achRoutingNumber: '987654321',
        achAccountNumber: '123456789',
        achAccountType: 'CHECKING',
        foo: 'bar'
      });
    });

    it('sends a post', function(){
      assert.equal(this.data.method, 'POST');
    });

    it('posts to the right path', function(){
      assert.equal(this.data.path, '/transactions');
    });
  });

  describe('read', function(){
    beforeEach(function(done){
      var test = this;

      this.transaction = payjunction.transaction.read({ id: 543 });
      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('gets from the right path', function(){
      assert.equal(this.data.path, '/transactions/543');
    });

    it('sends a get', function(){
      assert.equal(this.data.method, 'GET');
    });
  });

  describe('update', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.transaction.update({
        id: 654,
        foo: 'baz'
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('passes the right data', function(){
      assert.deepEqual(this.data.requestBody, {
        foo: 'baz'
      });
    });

    it('sends a put', function(){
      assert.equal(this.data.method, 'PUT');
    });

    it('uses the right path', function(){
      assert.equal(this.data.path, '/transactions/654');
    });
  });

  describe('addSignature', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.transaction.addSignature({
        id: 655,
        foo: 'baa'
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('passes the right data', function(){
      assert.deepEqual(this.data.requestBody, { foo: 'baa' });
    });

    it('sends a post', function(){
      assert.equal(this.data.method, 'POST');
    });

    it('uses the right path', function(){
      assert.equal(this.data.path, '/transactions/655/signature/capture');
    });
  });
})

