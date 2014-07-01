# payjunction-nodejs [![TravisCI][travis-img-url]][travis-ci-url]
[travis-img-url]: https://travis-ci.org/brandedcrate/payjunction-nodejs.svg?branch=master
[travis-ci-url]: http://travis-ci.org/brandedcrate/payjunction-nodejs

A [PayJunction](https://www.payjunction.com/) API client for [node](http://nodejs.org)

## Installation
```bash
$ npm install payjunction
```

## Usage
You will need a PayJunction account in order to use this library. If you don't
have one, you should [sign
up](https://www.payjunctionlabs.com/trinity/merchant-accounts/pricing.action).
If you already have an account, then you can get started by requiring this
library and instantiating a PayJunctionClient object:
```javascript
var PayJunctionClient = require('payjunction');

// set the connection parameters to your own values
var payjunction = new PayJunctionClient({
  username: 'YOUR-USERNAME',
  password: 'YOUR-PASSWORD',
  appkey: 'YOUR-APP-KEY',
  endpoint: 'test' // use 'live' for production
});
```

The API client has a property for each of the resources it supports
(transactions, receipts and customers) and each property has a method for each
of the supported actions. Each of the methods return an object that emits
events for you to handle. The client itself uses
[restler](https://github.com/danwrong/restler) under the hood, so you can read
all about which events are available and callback signatures for each event in
the restler documentation.

The examples here use the 'complete' event which can be used to handle both
success and failure events in the same callback, but restler allows much more
flexibility in this area if you need it.

## Examples
Consult the [PayJunction API
Documentation](https://developer.payjunction.com/documentation/) for
information about all the available API resources and actions including what
parameters can be set and example responses.

### Transactions
Create a transaction for a keyed credit card:
```javascript
payjunction.transaction.create({
  cardNumber: 4444333322221111,
  cardExpMonth: '01',
  cardExpYear: '18',
  cardCvv: 999,
  amountBase: '99.50'
}).on('complete', function(data){
  console.log(data);
});
```

Create a transaction for a swiped credit card:
```javascript
payjunction.transaction.create({
  cardTrack: '%B4444333322221111^First/Last^1712980100000?;4444333322221111=1712980100000?',
  amountBase: '12.00'
}).on('complete', function(data){
  console.log(data);
});
```

Create a transaction for an ACH transfer:
```javascript
payjunction.transaction.create({
  achRoutingNumber: 104000016,
  achAccountNumber: 123456789,
  achAccountType: 'CHECKING',
  achType: 'PPD',
  amountBase: '21.00'
}).on('complete', function(data){
  console.log(data);
});
```

Create a new transaction from a previous transaction:
```javascript
payjunction.transaction.create({
  transactionId: 74600
}).on('complete', function(data){
  console.log(data);
});
```

Void a transaction:
```javascript
var transaction = payjunction.transaction.update(74600, {
  status: 'VOID'
}).on('complete', function(data){
  console.log(data);
});
```

Read a transaction:
```javascript
var transaction = payjunction.transaction.read(74600).on('complete, function(data){
  console.log(data);
});
```

Add signature to transaction:
```javascript
payjunction.transaction.addSignature({
  id: 74600,
  // JSON signature document or raw data from a capture device
  signature: '{"width":500,"height":100,"points":[[],[109,63],[109,63],[108,63],[108,62]]}'
}).on('complete', function(data){
  console.log(data);
});
```

### receipts
Read receipt data by transaction id:
```javascript
payjunction.receipt.read(74600).on('complete', function(data){
  console.log(data);
});
```

Sent an email receipt:
```javascript
payjunction.receipt.email(74600, {
  to: 'stephen@brandedcrate.com',
  replyTo: 'foobar@anything.com'
}).on('complete', function(data){
  console.log(data);
});
```

### customers
Create a customer:
```javascript
client.customer.create({
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
}).on('complete', function(data){
  console.log(data);
});
```

Delete a customer:
```javascript
client.customer.delete(1).on('complete', function(data){
  console.log(data);
});
```

## Running Tests
To run the test suite, first run npm install to install the development dependencies:
```sh
$ npm install
```

Then run the tests:
```sh
$ npm test
```

## Maintainer
This package is maintained by [Branded Crate](http://www.brandedcrate.com/).

## License
This package is released under the MIT License.
