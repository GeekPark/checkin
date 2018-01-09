import mongo from './mongo'
import utils from './utils'
import fs    from 'fs'
import iconv from 'iconv-lite'
import config from './config'

const {TICKETS} = config
const date = new Date();
date.setYear(2016);
date.setMonth(1, 0);
console.log('正在获取', utils.dateformat(date), '起的票务数据')

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

const assign = (others) => {
  return Object.assign({checkin: true}, others);
}
const count = async (req, res)=> {
  const total = []
  for (let el of TICKETS) {
    const count = await mongo.tickets.count({ticket_cat_id: el[0]})
    total.push([count, el[1]])
  }
  // console.log(total)
  res.send(total)
}



const cancel = async (req, res)=> {
  const {ticket_no = null} = req.params;
  if (ticket_no === null) {return res.send({msg: 'params error'});}
  const ticket = await mongo.tickets.findOne({ticket_no: ticket_no});
  if (ticket === null) {return res.send({msg: '-1'});} // 未找到
  await mongo.tickets.update({ticket_no: ticket_no}, {checkin: false, checkin_time: ''});
  res.json({msg: '1'});
}


// 干 烦人的逻辑
const search = async (req, res)=> {
  const ticket_cat_ids = TICKETS.map(el => el[0])
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
    const filter_catid = handled.filter(el => {
      if (ticket_cat_ids.indexOf(el.ticket_cat.id) >= 0) {
        return true
      }
      return false
    })
    return res.send(filter_catid);
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
  const filter_catid = typed_user.filter(el => {
    if (ticket_cat_ids.indexOf(el.ticket_cat.id) >= 0) {
      return true
    }
    return false
  })
  res.send(filter_catid);
}


const exportData = async (req, res)=> {

  const checkin_true = await exportAll(true, "已签到.csv")
  const checkin_false = await exportAll(false, "全部.csv")
  const all = checkin_true.obj.concat(checkin_false.obj)
  const total = all.length

  const keys = ['position', 'competency' , 'industry'];

  keys.forEach(k => {
    const wants = {}
    all.forEach(el => {
      if (wants[el.personal[k]] === undefined) {
        wants[el.personal[k]] = 1
      } else {
        wants[el.personal[k]] += 1
      }
    })
    const percent = Object.keys(wants).map(key => {
      return `${key} = ${wants[key]} = ${(wants[key] / total * 100).toFixed(2)}\n`
    })
    fs.writeFile(`md/${k}.md`, percent.join(''), { encoding: 'utf8' }, function(err) {
    })
  })

  res.send("success")
}

async function exportAll(isCheck, name) {
  let match = {}
  if (isCheck) {
    match = {"$match": {"checkin": true}}
  } else {
    match = {"$match": {"$nor":[{"checkin": true}]}}
  }
  const tickets = await mongo.tickets.aggregate([
         match,
        { $lookup: {
          from: "personal_infos",
          localField: "user_id",
          foreignField: "user_id",
          as: "personal"
         }
       },
       { $unwind: "$personal" }
      ]);

  const section = "realname\temail\tmobile\tposition\tindustry\tcompetency\tcheckin_time\n"
  const checkinCsv =  tickets.map((el) => {
    return `${el.personal.realname}\t${el.personal.email}\t${el.personal.mobile}\t${el.personal.position}\t${el.personal.industry}\t${el.personal.competency}\t${el.checkin_time}\n`
  })
  // fs.writeFile(name, '\ufeff' + (section + checkinCsv), { encoding: 'utf16le' }, function(err) {
  // })
  return {str: checkinCsv, obj: tickets}
}

export default {
  checkdb,
  check_ticket,
  search,
  cancel,
  count,
  exportData
}
