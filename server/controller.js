import mongo from './mongo'
import utils from './utils'
import fs    from 'fs'
import iconv from 'iconv-lite'

const readcsv = function (path) {
  const fileStr = fs.readFileSync(`./csv/${path}`, {encoding:'binary'});
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
  console.log(`读取${path}完成, 共${values.length}条数据`)
  return values;
}

const checkdb = function () {
  mongo.tickets.count({}, (err, data)=> {
    if (data <= 0) {
      console.log('无数据, 正在导入...');
      const ticket_cats = readcsv('public.ticket_cats.csv');
      mongo.types.collection.insert(ticket_cats, (err, result) => {
        err && console.log(err);
      });
      const tickets = readcsv('public.tickets.csv');
      mongo.tickets.collection.insert(tickets, (err, result) => {
        err && console.log(err);
      });
      const users = readcsv('public.users.csv');
      mongo.users.collection.insert(users, (err, result) => {
        err && console.log(err);
      });
    } else {
      console.log(`已存在数据, 一共${data}条`);
    }
  });
}

const check_ticket = async (req, res)=> {
   const {ticket_no = null} = req.params;
   if (ticket_no === null) {return res.send({msg: 'params error'});}
   const ticket = await mongo.tickets.findOne({ticket_no: ticket_no});
   if (ticket === null) {return res.send({msg: '-1'});}
   const ticket_cat = await mongo.types.findOne({id: ticket.ticket_cat_id});
   const user =  await mongo.users.findOne({id: ticket.user_id});
   if (ticket.checkin === false) { // 未取票
      ticket.checkin = true,
      ticket.checkin_time = utils.dateformat(new Date());
      ticket.save();
      res.json({
       data: {
         ticket,
         ticket_cat,
         user
       }
     });
   } else { // 已取票
     res.json({msg: '1'});
   }

}

export default {
  checkdb,
  check_ticket
}
