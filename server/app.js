import express        from 'express';
import path           from 'path';
import logger         from 'morgan';
import cookieParser   from 'cookie-parser';
import bodyParser     from 'body-parser';
import methodOverride from 'method-override';
import basicAuth      from 'basic-auth-connect';
import utils          from './utils';
import mongo          from './mongo';
import controller     from  './controller';

const  app            = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));
//basic auth
// app.use('/', [basicAuth('username', 'password'), express.static(path.join(__dirname, '../pages/dist'))]);
app.use('/', [express.static(path.join(__dirname, '../pages/dist'))]);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin',      '*');
  res.header('Access-Control-Allow-Methods',     'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers',     'X-Requested-With,content-type');
  // res.header('Access-Control-Allow-Credentials', 'true');
  next();
})


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    msg: err.message,
    err: err
  });
});

// routes
mongo.connect();
controller.checkdb();

app.get('/check/:ticket_no', controller.check_ticket);
app.get('/cancel/:ticket_no', controller.cancel);
app.get('/count', controller.count);
app.get('/search/:key/:value', controller.search);
app.get('/export', controller.exportData);
app.get('/gift/:phone', controller.gift);



console.log('=====================================================');
console.log('ERIC SERVICES START AT ' + utils.dateformat(new Date()));
console.log('=====================================================');
export default app;
