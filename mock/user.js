import { parse } from 'url';
import moment from 'moment';
import { toJSON } from '../functions/toJson';

// mock users
let users = [];
for (let i = 1; i < 46; i += 1) {
  users.push({
    id: 100 + i,
    username: `user${i}`,
    name: `user${i}`,
    password: `user${i}`,
    email: `user${i}@demo.com`,
    phone: `+86-${i + 15200000000}`,
    gender: `${Math.floor(Math.random() * 2) === '0' ? 'male' : 'female'}`,
    institute: `institute ${i}`,
    arrivalDate: `${moment()
      .add(Math.floor(Math.random() * 30), 'days')
      .format('YYYY-MM-DD')}`,
    departureDate: `${moment()
      .add(10 + Math.floor(Math.random() * 30), 'days')
      .format('YYYY-MM-DD')}`,
    room: `${Math.floor(Math.random() * 2) === '0' ? 'single' : 'double'}`,
    dietRequirement: `${Math.floor(Math.random() * 2) === '0' ? 'single' : 'double'}`,
    talkTitle: `${Math.floor(Math.random() * 2) === '0' ? 'talk xxx' : 'talk yyy'}`,
    talkAbstract: `${
      Math.floor(Math.random() * 2) === '0' ? 'talkAbstract xxx' : 'talkAbstract yyy'
    }`,
    authority: `user`,
    status: Math.floor(Math.random() * 10) % 2,
  });
}

const findUserbyId = id => {
  let foundUser = {};
  let foundIndex = -1;
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
  return { index: foundIndex, user: foundUser };
};

const findUserbyUsername = username => {
  let foundUser = {};
  let foundIndex = -1;
  [foundUser] = users;
  foundIndex = 0;
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    if (user.username === username) {
      foundUser = user;
      foundIndex = index;
      break;
    }
  }
  return { index: foundIndex, user: foundUser };
};

const getUserById = (req, res, u, b) => {
  // get the id
  const { id } = req.params;
  const { index, user } = findUserbyId(id);
  if (index !== -1) {
    return res.json({ code: 0, message: 'ok', data: { user } });
  }
  return res.json({ code: -1, message: `user for id: ${id} not found` });
};

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
  const body = (b && b.body) || req.body;
  const addedUser = {
    ...body,
    id: users[users.length - 1].id + 1,
    arrivalDate: moment(body.arrivalDate).format('YYYY-MM-DD'),
    departureDate: moment(body.departureDate).format('YYYY-MM-DD'),
  };
  console.info(`add user ${JSON.stringify(addedUser)}`);
  users.push(addedUser);
  return res.send({
    code: 0,
    message: 'ok',
    data: { user: addedUser },
  });
};

const updateUser = (req, res, u, b) => {
  console.info(`{req, res, u, b}: ${toJSON({ req, res, u, b }, 3)}`);
  const { id } = req.params;
  const body = (b && b.body) || req.body;
  const { index } = findUserbyId(id);
  if (index !== -1) {
    const updatedUser = {
      ...body,
      id,
      arrivalDate: moment(body.arrivalDate).format('YYYY-MM-DD'),
      departureDate: moment(body.departureDate).format('YYYY-MM-DD'),
    };
    console.info(`update user ${JSON.stringify(updatedUser)}`);
    users.splice(index, 1, updatedUser);
    return res.send({
      code: 0,
      message: 'ok',
      data: { user: updatedUser },
    });
  }
  return res.json({ code: -1, message: `user for id: ${id} not found` });
};

const deleteUsers = (req, res, u, b) => {
  const body = (b && b.body) || req.body;
  const { method, id } = body;
  let foundUser;
  let foundIndex;
  const deletedUsers = id.map(idValue => {
    [foundUser] = users;
    foundIndex = 0;
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      if (user.id === idValue) {
        foundUser = user;
        foundIndex = index;
        break;
      }
    }
    return { index: foundIndex, user: foundUser };
  });
  console.info(`delete users ${JSON.stringify(deletedUsers.map(item => item.user))}`);
  users = users.filter((user, index) => !deletedUsers.map(item => item.index).includes(index));
  return res.send({
    code: 0,
    message: 'ok',
    data: { users: deletedUsers.map(item => item.user) },
  });
};

const deleteUserById = (req, res, u, b) => {
  const { id } = req.params;
  const { index, user } = findUserbyId(id);
  if (index !== -1) {
    console.info(`delete user ${JSON.stringify(user)}`);
    users.splice(index, 1);
    return res.send({
      code: 0,
      message: 'ok',
      data: { user },
    });
  }
  return res.json({ code: -1, message: `user for id: ${id} not found` });
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
  console.info(
    `login ${JSON.stringify({ password, username, type })}, req.body: ${JSON.stringify(req.body)}`
  );
  if (password === 'user1' && username === 'user1') {
    const { user } = findUserbyUsername('user1');
    res.send({
      code: 0,
      message: 'ok',
      type,
      currentAuthority: 'admin',
      data: { user: { ...user, authority: 'admin' } },
    });
    return;
  }
  const user = users.filter(
    item => (item.username === username || item.email === username) && item.password === password
  );
  if (user.length > 0) {
    res.send({
      code: 0,
      message: 'ok',
      type,
      currentAuthority: 'user',
      data: { user },
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
  res.send({ code: 0, message: 'ok', currentAuthority: 'user', data: { user } });
};

export default {
  'POST /api/public/login': login,
  'POST /api/public/register': register,
  'GET /api/private/users/': getUsers,
  'POST /api/private/users/': saveUser,
  'PUT /api/private/users/': updateUser,
  'DELETE /api/private/users/': deleteUsers,
  'GET /api/private/users/:id': getUserById,
  'DELETE /api/private/users/:id': deleteUserById,
};
