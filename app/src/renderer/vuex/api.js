
const router = app.router;

const isProd = process.env.NODE_ENV === 'production'
const host = isProd ? 'https://taobao.ericjj.com/api/' : 'http://127.0.0.1:3003/api/'

const base_url = `${host}v1`



const axios = require('axios').create({
  baseURL: base_url,
  timeout: 50000,
  withCredentials: true, // 允许跨域 cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    console.log(data);
    let json = {};

    try {
      json = JSON.parse(data);
    } catch (e) {
      json = {};
    }

    if (json.msg === 'sessionerror') {
      console.log('session error');
      // router.push('/login');
      process.exit();
    }

    return json;
  }],
});


// get
export default {
  _get : (req) => {
    const params = Object.assign({roles: 'dev'}, req.data)
    return axios.get(req.url, {params})
  },

// put
  _put : (req) => {
    return axios({ method: 'put', url: `/${req.url}`, data: req.data })
  },

// post
  _post : (req) => {
    return axios({ method: 'post', url: `/${req.url}`, data: req.data })
  },

// post
  _patch : (req) => {
    return axios.patch(`/${req.url}`,{data: req.data })
  },

// delete
  _delete : (req) => {
    return axios({ method: 'delete', url: `/${req.url}`, data: req.data })
  },

}
