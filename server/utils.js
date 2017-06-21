import moment         from 'moment';


const dateformat = (obj, format) => {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if (process.env.NODE_ENV === 'test') {
    return obj;
  }
  return moment(obj).format(format);
}

export default {
  dateformat
}

