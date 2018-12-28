// 代码中会兼容本地 service mock 以及部署站点的静态数据

const users = [
  {
    key: '1',
    username: '1',
    password: '1',
    name: 'John Brown',
    email: '1@111.com',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    username: '2',
    password: '2',
    email: '2@111.com',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    username: '3',
    password: '3',
    email: '3@111.com',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

export default {
  // 支持值为 Object 和 Array
  'GET /api/users/1': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users/': [...users],
  'POST /api/users/login': (req, res) => {
    const { password, username, type } = req.body;
    if (password === '1' && username === '1') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    const user = users.filter(item => item.username === username && item.password === password);
    if (user.length > 0) {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/users/register': (req, res) => {
    const { password, username, email } = req.body;
    users.push({
      username,
      password,
      email,
      name: username,
    });
    res.send({ status: 'ok', currentAuthority: 'user', users });
  },
};
