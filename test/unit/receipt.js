var PayjunctionClient = require('lib/payjunction'),
    assert = require('assert'),
    server = require('./echo-server');

var assert = require("assert")
describe('receipts', function(){
  before(server.start);
  after(server.end);

  var payjunction = new PayjunctionClient({
    username: 'pj-ql-01',
    password: 'pj-ql-01p',
    appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
    endpoint: 'http://localhost:3000'
  });

  describe('read', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.receipt.read(1234);

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('sends a get', function(){
      assert.equal(this.data.method, 'GET');
    });

    it('uses the right path', function(){
      assert.equal(this.data.path, '/transactions/1234/receipts/latest');
    });
  });

  describe('readThermal', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.receipt.readThermal(1234);

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('sends a get', function(){
      assert.equal(this.data.method, 'GET');
    });

    it('uses the right path', function(){
      assert.equal(this.data.path, '/transactions/1234/receipts/latest/thermal');
    });
  });

  describe('readFullpage', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.receipt.readFullpage(1234);

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('sends a get', function(){
      assert.equal(this.data.method, 'GET');
    });

    it('uses the right path', function(){
      assert.equal(this.data.path, '/transactions/1234/receipts/latest/fullpage');
    });
  });

  describe('email', function(){
    beforeEach(function(done){
      var test = this;
      this.transaction = payjunction.receipt.email(1235, {
        otherData: 'hi'
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('sends a post', function(){
      assert.equal(this.data.method, 'POST');
    });

    it('uses the right path', function(){
      assert.equal(this.data.path, '/transactions/1235/receipts/latest/email');
    });

    it('sends the right data', function(){
      assert.deepEqual(this.data.requestBody, { otherData: 'hi' });
    });
  });
})

