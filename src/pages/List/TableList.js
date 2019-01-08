import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
// const { RadioGroup, RadioButton } = Radio;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['Enable', 'Disable'];

@Form.create()
class ViewFormModal extends Component {
  render() {
    const { visible, record, handleModalVisible } = this.props;
    return (
      <Modal
        title="View"
        visible={visible}
        onOk={() => handleModalVisible(false)}
        cancelButtonProps={{ display: 'none', disabled: true }}
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Modal>
    );
  }
}

@Form.create()
class EditFormModal extends Component {
  state = {
    record: this.props.record,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.info(`getDerivedStateFromProps: nextProps ${JSON.stringify(nextProps)}`);
    return {
      record: nextProps.record,
    };
  }

  render() {
    const { visible, handleModalVisible, handleEditModal, form, action } = this.props;
    const { getFieldDecorator } = form;
    const { record } = this.state;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Modal
        title={action}
        visible={visible}
        onOk={handleEditModal(record)}
        onCancel={() => handleModalVisible(false)}
      >
        <Form>
          <FormItem label="username">
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Enter the username!' }],
              initialValue: record.username,
            })(<Input placeholder="Enter the username!" />)}
          </FormItem>
          <FormItem label="password">
            {getFieldDecorator('password', {
              rules: [{ required: action === 'create', message: 'Enter the password!' }],
              initialValue: '',
            })(<Input placeholder="Enter the password!" />)}
          </FormItem>
          <FormItem label="email">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.email.required' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'validation.email.wrong-format' }),
                },
              ],
              initialValue: record.email,
            })(<Input placeholder="Enter the email!" />)}
          </FormItem>
          <FormItem label="name">
            {getFieldDecorator('name', {
              rules: [{ required: false, message: 'Enter the name!' }],
              initialValue: record.name,
            })(<Input placeholder="Enter the name!" />)}
          </FormItem>
          <FormItem label="phone">
            {getFieldDecorator('phone', {
              rules: [{ required: false, message: 'Enter the phone!' }],
              initialValue: record.phone,
            })(<Input placeholder="Enter the phone!" />)}
          </FormItem>
          <FormItem label="gender">
            {getFieldDecorator('gender', {
              initialValue: record.gender,
            })(
              <RadioGroup>
                <RadioButton value="male">male</RadioButton>
                <RadioButton value="female">female</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="institute">
            {getFieldDecorator('institute', {
              rules: [{ required: false, message: 'Enter the institute!' }],
              initialValue: record.institute,
            })(<Input placeholder="Enter the institute!" />)}
          </FormItem>
          <FormItem label="arrivalDate">
            {getFieldDecorator('arrivalDate', {
              initialValue: record.arrivalDate ? moment(record.arrivalDate, dateFormat) : null,
            })(<DatePicker format={dateFormat} />)}
          </FormItem>
          <FormItem label="departureDate">
            {getFieldDecorator('departureDate', {
              initialValue: record.departureDate ? moment(record.departureDate, dateFormat) : null,
            })(<DatePicker format={dateFormat} />)}
          </FormItem>
          <FormItem label="room">
            {getFieldDecorator('room', {
              initialValue: record.room,
            })(
              <RadioGroup>
                <RadioButton value="single">single</RadioButton>
                <RadioButton value="double">double</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="dietRequirement">
            {getFieldDecorator('dietRequirement', {
              rules: [{ required: false, message: 'Enter the dietRequirement!' }],
              initialValue: record.dietRequirement,
            })(<Input placeholder="Enter the dietRequirement!" />)}
          </FormItem>
          <FormItem label="talkTitle">
            {getFieldDecorator('talkTitle', {
              rules: [{ required: false, message: 'Enter the talkTitle!' }],
              initialValue: record.talkTitle,
            })(<Input placeholder="Enter the talkTitle!" />)}
          </FormItem>
          <FormItem label="talkAbstract">
            {getFieldDecorator('talkAbstract', {
              rules: [{ required: false, message: 'Enter the talkAbstract!' }],
              initialValue: record.talkAbstract,
            })(<Input.TextArea placeholder="Enter the talkAbstract!" rows={5} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    viewModalVisible: false,
    editModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    record: {},
    action: 'edit',
  };

  columns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'username',
      dataIndex: 'username',
    },
    {
      title: 'institute',
      dataIndex: 'institute',
    },
    {
      title: 'arrivalDate',
      dataIndex: 'arrivalDate',
    },
    {
      title: 'departureDate',
      dataIndex: 'departureDate',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      sorter: true,
    },
    {
      title: 'Operation',
      render: (text, record) => (
        <Fragment>
          {/* <a onClick={() => this.handleViewModalVisible(true, record)}>View</a> */}
          <Divider type="vertical" />
          <a onClick={() => this.handleEditModalVisible(true, record, 'edit')}>Edit</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    // {"pagination":{"showSizeChanger":true,"showQuickJumper":true,"total":45,"pageSize":10,"current":2},"filtersArg":{},"sorter":{}}
    console.info(
      `handleStandardTableChange: pagination, filtersArg, sorter: ${JSON.stringify({
        pagination,
        filtersArg,
        sorter,
      })}`
    );
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    console.info(`params: ${JSON.stringify(params)}`);
    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'user/remove',
          payload: {
            id: selectedRows.map(row => row.id),
          },
          callback: () => {
            console.info(`callback`);
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'user/fetch',
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'user/fetch',
        payload: values,
      });
    });
  };

  handleViewModalVisible = (visible, record) => {
    this.setState({
      viewModalVisible: !!visible,
      record: record || {},
    });
  };

  handleEditModalVisible = (visible, record, action = 'edit') => {
    console.info(`handleEditModalVisible record: ${JSON.stringify(record)}`);
    this.setState({
      editModalVisible: !!visible,
      record: record || {},
      action,
    });
    const { form } = this.formRef.props;
    form.resetFields();
  };

  handleEditModal = record => e => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(`Received values of form: ${JSON.stringify(values)}`);

      const { dispatch } = this.props;
      const updatedUser = {
        ...record,
        ...values,
      };
      if (!updatedUser.password) {
        delete updatedUser.password;
      }
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`);
      dispatch({
        type: 'user/update',
        payload: {
          ...updatedUser,
        },
      });
      dispatch({
        type: 'user/fetch',
      });
      form.resetFields();
      this.setState({ editModalVisible: false });
    });
  };

  handleAddModal = record => e => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(`Received values of form: ${JSON.stringify(values)}`);

      const { dispatch } = this.props;
      const updatedUser = {
        ...record,
        ...values,
      };
      console.log(`updatedUser: ${JSON.stringify(updatedUser)}`);
      dispatch({
        type: 'user/add',
        payload: {
          ...updatedUser,
        },
      });
      dispatch({
        type: 'user/fetch',
      });
      form.resetFields();
      this.setState({ editModalVisible: false });
    });
  };

  // handleAdd = fields => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'user/add',
  //     payload: {
  //       desc: fields.desc,
  //     },
  //   });

  //   message.success('添加成功');
  //   this.handleModalVisible();
  // };

  // handleUpdate = fields => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'user/update',
  //     payload: {
  //       name: fields.name,
  //       desc: fields.desc,
  //       key: fields.key,
  //     },
  //   });
  //   message.success('配置成功');
  //   this.handleUpdateModalVisible();
  // };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="username">
              {getFieldDecorator('name')(<Input placeholder="Input the username" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status">
              {getFieldDecorator('status')(
                <Select placeholder="Please choose" style={{ width: '100%' }}>
                  <Option value="0">Enable</Option>
                  <Option value="1">Disable</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Fold down <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="username">
              {getFieldDecorator('name')(<Input placeholder="Enter the username" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status">
              {getFieldDecorator('status')(
                <Select placeholder="Please Choose" style={{ width: '100%' }}>
                  <Option value="0">Enable</Option>
                  <Option value="1">Disable</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="email">
              {getFieldDecorator('number')(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="phone">
              {getFieldDecorator('date')(
                <Input style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Fold up <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { user, loading } = this.props;
    const data = {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
    };
    console.info(`user: ${JSON.stringify(user)}`);
    if (user.data && user.data.users) {
      data.list = user.data.users;
      data.pagination = {
        total: user.data.count,
        pageSize: user.data.pageSize,
        current: user.data.currentPage,
      };
    }
    console.info(`data: ${JSON.stringify(data)}`);
    const { selectedRows, viewModalVisible, editModalVisible, record, action } = this.state;
    console.info(`render data: ${JSON.stringify(data)}`);
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Remove</Menu.Item>
        <Menu.Item key="enable">Enable</Menu.Item>
        <Menu.Item key="disable">Disable</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="User Management Table">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleEditModalVisible(true, null, 'create')}
              >
                Create
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>Batch Operation</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      More <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ViewFormModal
          visible={viewModalVisible}
          record={record}
          handleModalVisible={this.handleViewModalVisible}
        />
        <EditFormModal
          wrappedComponentRef={this.saveFormRef}
          visible={editModalVisible}
          record={record}
          handleModalVisible={this.handleEditModalVisible}
          handleEditModal={action === 'edit' ? this.handleEditModal : this.handleAddModal}
          action={action}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
