
const router = app.router;

const isProd = process.env.NODE_ENV === 'production'
const base_url = isProd ? '' : 'http://127.0.0.1:3000/'



const axios = require('axios').create({
  baseURL: base_url,
  timeout: 50000,
  // withCredentials: true, // 允许跨域 cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    // console.log(data);
    let json = {};
    try {
      json = JSON.parse(data);
    } catch (e) {
      json = {};
    }

    return json;
  }],
});


// get
export default axios
