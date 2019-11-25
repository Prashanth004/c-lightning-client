const express = require("express");
const bodyParser = require("body-parser");
const invoiceApi = require("./routes/invoiceRoute");
const paymentApi = require("./routes/paymentRoute")
const keys = require('./config/keys')
var socket = require('socket.io');
var cors = require('cors');
var helmet = require('helmet');

const app = express();

app.use(cors());
app.use(helmet())
app.use(helmet({
  frameguard: false
}))
app.use(helmet.noCache())
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    vibrate: ["'none'"],
    payment: ['example.com'],
    syncXhr: ["'none'"]
  }
}))
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

  const port = process.env.PORT || keys.PORT;
server = app.listen(port, () => console.log(`Server running on port ${port}`));

io = socket(server);
app.use(function(req, res, next){
  res.io = io;
  next();
});


app.use("/api/invoice", invoiceApi);
app.use("/api/payment",paymentApi)
app.use([
    handleError
  ]);
  function handleError(err, req, res, next) {
    var output = {
      error: {
        name: err.name,
        message: err.message,
        text: err.toString()
      }
    };
  
    var statusCode = err.status || 500;
    res.status(statusCode).json(output);
  }
  app.get('*', function (req, res, next) {
    let err = new Error('Page Not Found');
    err.statusCode = 404;
    next(err);
  });
  


