# 极客公园签到系统

### 依赖
`node.js`, `mongo`

### 功能
- [x] 签到, 取消签到
- [x] 根据 取票码, 姓名, 邮箱, 手机号等信息查询
- [x] 统计

### 设计
经典 `b/s` 架构, 前端使用 `vue` `vue-router` `webpack`, 编译静态页面, 通过 server 端静态文件服务访问, 建立局域网, 通过 ip 访问, 必要时可开启 `http basic auth`

### 使用
1. 将 `public.ticket_cats.csv` `public.tickets.csv` `public.users.csv` `public.personal_infos.csv` `public.media_infos.csv` `public.orders.csv` `public.payments.csv`, 复制到 `server/csv` 目录下, 以上 `.csv` 文件由后端导出
2. 修改查询起始日期 `controller.js` 下 `date.setMonth(3, 0);` 函数
3.
``` bash
cd pages && yarn && npm run build
cd server && yarn && node index.js
```

### 复用
1. 修改 `controller.js` 中 统计的`ticket_cat_id`, 即可

### LICENSE
GPL3.0
