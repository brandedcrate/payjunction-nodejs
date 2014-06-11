# payjunction-nodejs [![TravisCI][travis-img-url]][travis-ci-url]

[travis-img-url]: https://travis-ci.org/brandedcrate/payjunction-nodejs.svg?branch=master
[travis-ci-url]: http://travis-ci.org/brandedcrate/payjunction-nodejs

```javascript
var PayJunctionClient = require('payjunction');
```

## instantiate the api client
```javascript
var payjunction = new PayJunctionClient({
  username: 'YOUR-USERNAME',
  password: 'YOUR-PASSWORD',
  appkey: 'YOUR-APP-KEY',
  endpoint: 'test' // or use 'live' for production
});
```

## process a transaction
```javascript
payjunction.transaction.create({
  achRoutingNumber: 104000016,
  achAccountNumber: 123456789,
  achAccountType: 'CHECKING',
  achType: 'PPD',
  status: 'CAPTURE',
  action: 'CHARGE',
  amountBase: '21.00'
}).on('complete', function(data){
  console.log(data);
});
```

## re-bill by transaction id
```javascript
payjunction.transaction.create({
  transactionId: 74600
}).on('complete', function(data){
  console.log(data);
});
```

## add signature to transaction
The signature can be a JSON document or just raw data from a capture device
```javascript
payjunction.transaction.addSignature({
  id: 74600,
  signature: '{"width":500,"height":100,"points":[[],[109,63],[109,63],[108,63],[108,62]]}'
}).on('complete', function(data){
  console.log(data);
});
```

## get receipt information
```javascript
payjunction.receipt.read({
  transactionId: 74600
}).on('complete', function(data){
  console.log(data);
});
```

## email a receipt
```javascript
payjunction.receipt.email({
  transactionId: 74600,
  to: 'stephen@brandedcrate.com',
  replyTo: 'foobar@anything.com'
}).on('complete', function(data){
  console.log(data);
});
```

## create a customer
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

## delete a customer
```javascript
client.customer.delete(1).on('complete', function(data){
  console.log(data);
});
```
