var PayjunctionClient = require('lib/payjunction'),
    assert = require('assert');

var payjunction = new PayjunctionClient({
  username: 'pj-ql-01',
  password: 'pj-ql-01p',
  appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
  endpoint: 'test'
});

var createCustomer = function(done){
  var test = this;

  var request = payjunction.customer.create({
    companyName: 'ACME, inc.',
    email: 'customer@acme.com',
    identifier: 'your-custom-id',
    firstName: 'Joe',
    jobTitle: 'Wage Slave',
    lastName: 'Schmoe',
    middleName: 'Ignatius',
    phone: '5555551212',
    phone2: '1234567890',
    website: 'acme.com'
  });

  request.on('complete', function(data){
    done(data);
  });
};

describe('customers', function(){
  describe('create a customer', function(done){
    it('creates a customer', function(done){
      createCustomer(function(data){
        assert.ok(data.customerId > 0);
        done();
      });
    });
  });

  describe('read a customer', function(done){
    it('creates and reads a customer', function(done){
      createCustomer(function(data){
        payjunction.customer.read(data.customerId).on('complete', function(data){
          assert.ok(data.customerId > 0);
          done();
        });
      });
    });
  });

  describe('delete a customer', function(done){
    it('creates and deletes a customer', function(done){
      createCustomer(function(data){
        payjunction.customer.delete(data.customerId).on('complete', function(data, response){
          assert.equal(response.statusCode, 204);
          done();
        });
      });
    });
  });

  describe('update a customer', function(done){
    it('creates and updates a customer', function(done){
      createCustomer(function(data){
        payjunction.customer.update({
          id: data.customerId,
          jobTitle: 'Head Honcho'
        }).on('complete', function(data, response){
          assert.equal(data.jobTitle, 'Head Honcho');
          done();
        });
      });
    });
  });
});
