import mongo from './mongo'
import utils from './utils'
import fs    from 'fs'
import iconv from 'iconv-lite'

const date = new Date();
date.setMonth(3, 0);
console.log(date)

const readcsv = function (path, filter) {
  const fileStr = fs.readFileSync(`./csv/${path}`, {encoding:'binary'});
  const buf     = new Buffer(fileStr, 'binary');
  const arr     = iconv.decode(buf, 'utf-8').split("\n");
  const keys    = arr[0].split(';');
  const values  = [];

  arr.forEach((el, index) => {
    if (index > 0) {
      const obj = {};
      el.split(';').forEach((val, keyIndex) => {
        obj[keys[keyIndex]] = val;
      })
      if (filter === true &&
         obj.created_at &&
         (new Date(obj.created_at)) < date) {
        return;
      } else {
        values.push(obj);
      }
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
      const tickets = readcsv('public.tickets.csv', true);
      mongo.tickets.collection.insert(tickets, (err, result) => {
        err && console.log(err);
      });
      const users = readcsv('public.users.csv');
      mongo.users.collection.insert(users, (err, result) => {
        err && console.log(err);
      });
      const personal_infos = readcsv('public.personal_infos.csv');
      mongo.personal_infos.collection.insert(personal_infos, (err, result) => {
        err && console.log(err);
      });
      const media_infos = readcsv('public.media_infos.csv');
      mongo.personal_infos.collection.insert(media_infos, (err, result) => {
        err && console.log(err);
      });
      const orders = readcsv('public.orders.csv');
      mongo.orders.collection.insert(orders, (err, result) => {
        err && console.log(err);
      });
      const payments = readcsv('public.payments.csv');
      mongo.payments.collection.insert(payments, (err, result) => {
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
   if (ticket === null) {return res.send({msg: '-1'});} // 未找到

   const userid     = ticket.user_id;
   const ticket_cat = await mongo.types.findOne({id: ticket.ticket_cat_id});
   const personal   = await mongo.personal_infos.findOne({user_id: userid});
   const payment    = await mongo.payments.findOne({order_id: ticket.order_id});
   const data       = {ticket, ticket_cat, personal, payment};

   if (ticket.checkin === false) { // 未取票
      ticket.checkin      = true,
      ticket.checkin_time = utils.dateformat(new Date());
      ticket.save();
      res.json({data});
   } else { // 已取票
     res.json({msg: '1', data});
   }
}


// name:极客超级票 id:c4c7334c-aee0-4740-834c-9d2f19d5fdd4
// name:8月5日 极客探索票 id:9c6e665a-e093-4e66-9ba0-b906bf14da56
// name:8月6日 极客探索票 id:a5d8e624-07d6-4b3c-8c14-0742ad3cb969
// name:极客前沿票 id:e53dce70-d0df-4584-94df-bb74143c3764
// name:极客信仰票 id:b44d07c8-511e-4fe8-94c5-0960471d72ca
const t_super_name = {ticket_cat_id: 'c4c7334c-aee0-4740-834c-9d2f19d5fdd4'}
const t_85_name    = {ticket_cat_id: '9c6e665a-e093-4e66-9ba0-b906bf14da56'}
const t_86_name    = {ticket_cat_id: 'a5d8e624-07d6-4b3c-8c14-0742ad3cb969'}
const t_faith_name = {ticket_cat_id: 'b44d07c8-511e-4fe8-94c5-0960471d72ca'}
const assign = (others) => {
  return Object.assign({checkin: true}, others);
}
const count = async (req, res)=> {
  const t_super         = await mongo.tickets.count(t_super_name)
  const t_super_checkin = await mongo.tickets.count(assign(t_super_name))
  const t_85            = await mongo.tickets.count(t_85_name)
  const t_85_checkin    = await mongo.tickets.count(assign(t_85_name))
  const t_86            = await mongo.tickets.count(t_86_name)
  const t_86_checkin    = await mongo.tickets.count(assign(t_86_name))
  const t_faith         = await mongo.tickets.count(t_faith_name)
  const t_faith_checkin = await mongo.tickets.count(assign(t_faith_name))
  res.send({t_super, t_super_checkin,
            t_85,    t_85_checkin,
            t_86,    t_86_checkin,
            t_faith, t_faith_checkin
          })
}



const cancel = async (req, res)=> {
  const {ticket_no = null} = req.params;
  if (ticket_no === null) {return res.send({msg: 'params error'});}
  const ticket = await mongo.tickets.findOne({ticket_no: ticket_no});
  if (ticket === null) {return res.send({msg: '-1'});} // 未找到
  await mongo.tickets.update({ticket_no: ticket_no}, {checkin: false});
  res.json({msg: '1'});
}


// 干 烦人的逻辑
const search = async (req, res)=> {
  const {key, value, index = '0'} = req.params;
  const limit = 30;
  const skip = parseInt(index) * limit;
  if (key === 'ticket_no') {
    const tickets = await mongo.tickets.aggregate([
        {"$match": {ticket_no:  {$regex: value, $options: 'i' }}},
        // {"$skip": skip},
        // {"$limit": limit},
        { $lookup: {
          from: "types",
          localField: "ticket_cat_id",
          foreignField: "id",
          as: "ticket_cat"
         }
       },
       { $lookup: {
          from: "personal",
          localField: "user_id",
          foreignField: "user_id",
          as: "personal"
         }
       },
      ]);
    const handled = await Promise.all(tickets.map(async el => {
      const cat = el.ticket_cat[0];
      delete el.ticket_cat;
      const user = await mongo.personal_infos.findOne({user_id: el.user_id});
      const payment = await mongo.payments.findOne({order_id: el.order_id});
      if (el.checkin !== true) {el.checkin = false;}
      return {user, ticket: el, ticket_cat: cat, payment};
    }))
    return res.send(handled);
  }
  const user_query = {};
  user_query[key] = {$regex: value, $options: 'i' };
  const exist_user = await mongo.personal_infos.aggregate([
                     { $match: user_query },
                     // {"$skip": skip},
                     // {"$limit": limit},
                     { $lookup: {
                        from: "tickets",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "ticket"
                       }
                     },
                     { $unwind: "$ticket" }
                     ]);
  // console.log(exist_user)
  const typed_user = await Promise.all(exist_user.map(async el => {
    const cat     = await mongo.types.findOne({id: el.ticket.ticket_cat_id});
    const payment = await mongo.payments.findOne({order_id: el.ticket.order_id})
    const ticket  = el.ticket;
    delete el.ticket;
    if (ticket.checkin !== true) {ticket.checkin = false;}
    return {ticket_cat: cat, payment, ticket, user: el};
  }))
  res.send(typed_user);
}

export default {
  checkdb,
  check_ticket,
  search,
  cancel,
  count
}
