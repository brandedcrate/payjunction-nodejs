# payjunction-nodejs

```javascript
var PayJunctionClient = require('payjunction');
```

## instantiate the api client
```javascript
var payjunction = new PayJunctionClient({
  username: 'YOUR-USERNAME',
  password: 'YOUR-PASSWORD',
  appkey: 'YOUR-APP-KEY',
  endpoint: 'https://api.payjunctionlabs.com' // test endpoint
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
