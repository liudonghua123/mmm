import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Modal, Form, Input, Radio, List } from 'antd';
// import { getTimeDistance } from '@/utils/utils';

// eslint-disable-next-line
@Form.create()
class UpdateFieldForm extends React.Component {
  render() {
    const { visible, onCancel, onUpdate, form, field, value } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={`Update ${field}`}
        okText="Update"
        onCancel={onCancel}
        onOk={onUpdate(field)}
      >
        <Form layout="vertical">
          {field !== 'password' && (
            <Form.Item label={`origin_${field}`}>
              {getFieldDecorator(`origin_${field}`, { initialValue: value })(<Input />)}
            </Form.Item>
          )}
          <Form.Item label={`${field}`}>{getFieldDecorator(`${field}`)(<Input />)}</Form.Item>
        </Form>
      </Modal>
    );
  }
}

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

@connect(({ user }) => ({
  user: user.currentUser,
}))
class SecurityView extends Component {
  state = {
    visible: false,
    field: 'password',
    value: '',
  };

  componentDidMount() {
    // get current user
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  showUpdateFormModal = (field, value) => () => {
    this.setState({ visible: true, field, value });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleUpdate = field => () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      const newValue = form.getFieldValue(field);
      console.info(`new ${field} value ${newValue} update`);

      const { dispatch, user } = this.props;
      dispatch({
        type: 'user/update',
        payload: {
          ...user,
          [field]: newValue,
        },
      });
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'login/updateLoginStatus',
        payload: {
          user: {
            ...user,
            [field]: newValue,
          },
        },
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  getData = () => {
    const { user } = this.props;
    const { email, phone } = user;
    return [
      {
        field: 'password',
        title: formatMessage({ id: 'app.settings.security.password' }, {}),
        description: (
          <Fragment>
            {formatMessage({ id: 'app.settings.security.password-description' })}：
            {passwordStrength.strong}
          </Fragment>
        ),
        actions: [
          <a>
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
      {
        field: 'phone',
        title: formatMessage({ id: 'app.settings.security.phone' }, {}),
        description: `${formatMessage(
          { id: 'app.settings.security.phone-description' },
          {}
        )}：${phone}`,
        actions: [
          <a>
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
      {
        field: 'email',
        title: formatMessage({ id: 'app.settings.security.email' }, {}),
        description: `${formatMessage(
          { id: 'app.settings.security.email-description' },
          {}
        )}：${email}`,
        actions: [
          <a>
            <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
          </a>,
        ],
      },
    ];
  };

  render() {
    const { visible, value, field } = this.state;
    const { user } = this.props;
    console.info(`user: ${JSON.stringify(user)}`);
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item
              actions={item.actions}
              onClick={this.showUpdateFormModal(item.field, user[item.field])}
            >
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <UpdateFieldForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onUpdate={this.handleUpdate}
          field={field}
          value={value}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
