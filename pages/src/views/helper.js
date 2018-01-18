// const replaceAll = function (str, search, replacement) {
//   return str.replace(new RegExp(search, 'g'), replacement)
// }

export default function (el) {
  let name = el.ticket_cat.name
  let price = ''
  try {
    price = el.payment.total_fee
    if (name === '极客先锋票') {
      name += '2017-01-19'
    } else if (name === '极客探索票') {
      name += '2017-01-20'
    } else if (name === '极客趣享票') {
      name += '2017-01-21'
    }
    if (el.payment.type === 'wxpay') {
      price = price / 100
    }
    // let str = replaceAll(el.payment.notify_json, '""', '"')
    // str = str.replace('"', '').replace('}"', '}')
    // el.payment.notify_json = JSON.parse(str)
  } catch (e) {
    el.payment = {price: price}
    console.log('未找到价格')
  }
  return {name, price}
}
