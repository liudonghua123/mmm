import { parse } from 'url';

// mock users
const users = [];
for (let i = 0; i < 46; i += 1) {
  users.push({
    id: 100 + i,
    username: `user${i}`,
    name: `user${i}`,
    password: `user${i}`,
    email: `user${i}@demo.com`,
    phone: `${i + 15200000000}`,
    address: `address ${i}`,
    age: `${i + 20}`,
    status: Math.floor(Math.random() * 10) % 2,
  });
}

const getUsers = (req, res, u) => {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = users;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
};

const saveUser = (req, res, u, b) => {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, phone, email, password, id } = body;
  let foundUser;
  let foundIndex;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      [foundUser] = users;
      foundIndex = 0;
      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        if (user.id === id) {
          foundUser = user;
          foundIndex = index;
          break;
        }
      }
      users.splice(foundIndex, 1);
      return res.send({
        status: 'ok',
        data: foundUser,
      });
    // users = users.filter(item => id.indexOf(item.id) === -1);
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      const addedUser = {
        id: i,
        username: `user${i}`,
        password: `user${i}`,
        phone: `${i + 15200000000}`,
        address: `address ${i}`,
        age: `${i + 20}`,
        status: Math.floor(Math.random() * 10) % 2,
      };
      users.unshift();
      return res.send({
        status: 'ok',
        data: addedUser,
      });
    case 'put':
      [foundUser] = users;
      foundIndex = 0;
      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        if (user.id === id) {
          foundUser = user;
          foundIndex = index;
          break;
        }
      }
      const updatedUser = { ...foundUser, phone, email, password };
      users.splice(foundIndex, 1, updatedUser);
      return res.send({
        status: 'ok',
        data: updatedUser,
      });
    default:
      break;
  }

  const result = {
    list: users,
    pagination: {
      total: users.length,
    },
  };
  return res.json(result);
};

const defaultDetailUser = {
  id: 1,
  username: '1',
  name: 'admin',
  email: 'antdesign@alipay.com',
  phone: '0752-268888888',
  password: '1',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
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
  country: 'China',
};

const login = (req, res) => {
  const { password, username, type } = req.body;
  if (password === '1' && username === '1') {
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
      user: defaultDetailUser,
    });
    return;
  }
  const user = users.filter(item => item.username === username && item.password === password);
  if (user.length > 0) {
    res.send({
      status: 'ok',
      type,
      currentAuthority: 'user',
      user,
    });
    return;
  }
  res.send({
    status: 'error',
    type,
    currentAuthority: 'guest',
  });
};

const register = (req, res) => {
  const { password, username, email } = req.body;
  const user = {
    username,
    password,
    email,
    name: username,
  };
  users.unshift(user);
  res.send({ status: 'ok', currentAuthority: 'user', user });
};

export default {
  'POST /api/users/login': login,
  'POST /api/users/register': register,
  'GET /api/users/1': defaultDetailUser,
  'GET /api/users/': getUsers,
  'POST /api/users/': saveUser,
  'PUT /api/users/': saveUser,
  'DELETE /api/users/': saveUser,
};
