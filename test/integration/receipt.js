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

describe('receipts', function(){
  describe('send a receipt', function(){
    it('creates a transaction and sends a receipt', function(done){
      createTransaction(function(data){
        payjunction.receipt.email(data.transactionId, {
          to: 'stephen+automation@brandedcrate.com',
          replyTo: 'foobar@whatever.com',
          requestSignature: true
        }).on('complete', function(data, response){
          assert.equal(response.statusCode, 204);
          done();
        });
      });
    });
  });

  describe('read a receipt', function(){
    before(function(done){
      var test = this;
      createTransaction(function(data){
        test.data = data;
        done();
      });
    });

    it('creates a transaction and reads the receipt', function(done){
      payjunction.receipt.read(this.data.transactionId).on('complete', function(data, response){
        assert.equal(response.statusCode, 200);
        assert.equal(data.hasOwnProperty('documents'), true);
        done();
      });
    });

    it('creates a transaction and reads the thermal receipt', function(done){
      payjunction.receipt.readThermal(this.data.transactionId).on('complete', function(data, response){
        assert.equal(response.headers['content-type'], 'text/html');
        assert.equal(data.length > 0, true);
        done();
      });
    });

    it('creates a transaction and reads the full page receipt', function(done){
      payjunction.receipt.readFullpage(this.data.transactionId).on('complete', function(data, response){
        assert.equal(response.headers['content-type'], 'text/html');
        assert.equal(data.length > 0, true);
        done();
      });
    });
  });
});
