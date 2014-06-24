var PayjunctionClient = require('lib/payjunction'),
    assert = require('assert');

var randomAmount = function(){
  var value = Math.random() * 10000;
  value = Math.round(value);
  value = value / 100;
  value = value + 5;
  return value;
};

var payjunction = new PayjunctionClient({
  username: 'pj-ql-01',
  password: 'pj-ql-01p',
  appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
  endpoint: 'test'
});

describe('transactions', function(){
  describe('creates a transaction', function(done){
    before(function(done){
      var test = this;
      this.transaction = payjunction.transaction.create({
        achRoutingNumber: 104000016,
        achAccountNumber: 123456789,
        achAccountType: 'CHECKING',
        achType: 'PPD',
        amountBase: randomAmount()
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('has no errors', function(){
      assert.equal(this.data.errors, undefined);
    });

    it('is approved', function(){
      assert.equal(this.data.response.approved, true);
    });

    it('status is capture', function(){
      assert.equal(this.data.status, 'CAPTURE');
    });
  });

  describe('voids a transaction', function(done){
    before(function(done){
      var test = this;
      var transaction = payjunction.transaction.create({
        achRoutingNumber: 104000016,
        achAccountNumber: 123456789,
        achAccountType: 'CHECKING',
        achType: 'PPD',
        amountBase: randomAmount()
      });

      transaction.on('complete', function(data){
        test.transactionId = data.transactionId;
        done();
      });
    });

    before(function(done){
      var test = this;
      var transaction = payjunction.transaction.update({
        id: this.transactionId,
        status: 'VOID'
      });

      transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    it('has no errors', function(){
      assert.equal(this.data.errors, undefined);
    });

    it('is approved', function(){
      assert.equal(this.data.response.approved, true);
    });

    it('status is void', function(){
      assert.equal(this.data.status, 'VOID');
    });
  });
})
