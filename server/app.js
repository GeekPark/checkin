import express        from 'express';
import path           from 'path';
import logger         from 'morgan';
import cookieParser   from 'cookie-parser';
import bodyParser     from 'body-parser';
import methodOverride from 'method-override';
import routers        from './routers';
import moment         from 'moment';
import mongo          from './mongo';
import controller     from  './controller';
const  app            = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));


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
const dateformat = function (obj, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if (process.env.NODE_ENV === 'test') {
    return obj;
  }
  return moment(obj).format(format);
}


console.log('=====================================================');
console.log('VMS SERVICES START AT ' + dateformat(new Date()));
console.log('=====================================================');
export default app;
