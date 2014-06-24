var bodyParser = require('body-parser'),
  express = require('express');

module.exports = {
  start: function(done){
    var app = express();

    app.use(bodyParser());

    var echo = function(req, res){
      res.send({
        headers: req.headers,
        path: req.path,
        method: req.method,
        requestBody: req.body
      });
    };

    app.all('*', echo);

    this.server = app.listen(3000);

    done();
  },
  end: function(done){
    this.server.close(done);
  }
}

