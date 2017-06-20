import mongo from './mongo'
import fs    from 'fs'
import iconv from 'iconv-lite'

const readcsv = function (path) {
  const fileStr = fs.readFileSync(path, {encoding:'binary'});
  const buf = new Buffer(fileStr, 'binary');
  const arr = iconv.decode(buf, 'utf-8').split("\n");
  const keys = arr[0].split(';');
  const values = [];
  arr.forEach((el, index) => {
    if (index > 0) {
      const obj = {};
      el.split(';').forEach((val, keyIndex) => {
        obj[keys[keyIndex]] = val;
      })
      values.push(obj);
    }
  })
  return values;
}

const checkdb = function () {
  mongo.tickets.count({}, (err, data)=> {
    if (data <= 0) {
      console.log('无数据, 正在导入...');
      var data = readcsv('public.ticket_cats.csv');
      console.log(data);
    } else {
      console.log(`已存在数据, 一共${data}条`);
    }
  });
}

export default {
  checkdb
}
