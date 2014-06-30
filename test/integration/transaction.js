var PayjunctionClient = require('lib/payjunction'),
    assert = require('assert');

var randomAmount = function(){
  var value = Math.random() * 10000;
  value = Math.round(value);
  value = value / 100;
  value = value + 5;
  return value.toFixed(2);
};

var payjunction = new PayjunctionClient({
  username: 'pj-ql-01',
  password: 'pj-ql-01p',
  appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
  endpoint: 'test'
});

var isSuccessfulTransaction = function(it) {
  it('has no errors', function(){
    assert.equal(this.data.errors, undefined);
  });

  it('is approved', function(){
    assert.equal(this.data.response.approved, true);
  });

  it('status is capture', function(){
    assert.equal(this.data.status, 'CAPTURE');
  });
};

var createTransaction = function(done){
  var test = this;
  this.transaction = payjunction.transaction.create({
    achRoutingNumber: 104000016,
    achAccountNumber: 123456789,
    achAccountType: 'CHECKING',
    achType: 'PPD',
    amountBase: randomAmount()
  });

  this.transaction.on('complete', function(data){
    done(data);
  });
};

describe('transactions', function(){
  describe('creates an ACH transaction', function(){

    before(function(done){
      var test = this;

      createTransaction(function(data){
        test.data = data;
        done();
      });
    });

    isSuccessfulTransaction(it);
  });

  describe('creates a credit card transaction (keyed)', function(done){
    before(function(done){
      var test = this;
      this.transaction = payjunction.transaction.create({
        cardNumber: 4444333322221111,
        cardExpMonth: '01',
        cardExpYear: '18',
        cardCvv: 999,
        amountBase: randomAmount()
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    isSuccessfulTransaction(it);
  });

  describe('creates a credit card transaction (keyed)', function(done){
    before(function(done){
      var test = this;
      this.transaction = payjunction.transaction.create({
        cardTrack: '%B4444333322221111^First/Last^1712980100000?;4444333322221111=1712980100000?',
        amountBase: randomAmount()
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    isSuccessfulTransaction(it);
  });

  describe('voids a transaction', function(){
    this.timeout(6000);

    before(function(done){
      var test = this;

      createTransaction(function(data){
        var transaction = payjunction.transaction.update({
          id: data.transactionId,
          status: 'VOID'
        });

        transaction.on('complete', function(data){
          test.data = data;
          done();
        });
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
