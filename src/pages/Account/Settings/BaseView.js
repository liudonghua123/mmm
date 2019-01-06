import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Radio, Select, Button, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './BaseView.less';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@connect(({ user }) => ({
  user: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    // get current user
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { user = {}, form } = this.props;
    const dateFormat = 'YYYY-MM-DD';
    console.info(`setBaseInfo user: ${JSON.stringify(user)}`);
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      if (key === 'arrivalDate' || key === 'departureDate') {
        obj[key] = moment(user[key], dateFormat) || null;
      } else {
        obj[key] = user[key] || null;
      }
      form.setFieldsValue(obj);
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  updateUserInfo = e => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(`Received values of form: ${JSON.stringify(values)}`);

      const { dispatch } = this.props;
      const updatedUserInfo = {
        ...values,
      };
      console.log(`updatedUserInfo: ${JSON.stringify(updatedUserInfo)}`);
      dispatch({
        type: 'user/update',
        payload: {
          user: updatedUserInfo,
        },
      });
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'login/updateLoginStatus',
        payload: {
          user: updatedUserInfo,
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const dateFormat = 'YYYY-MM-DD';
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Enter the name!', min: 5 }],
              })(<Input placeholder="Enter the name!" />)}
            </FormItem>
            <FormItem label="username">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Enter the username!', min: 5 }],
              })(<Input placeholder="Enter the username!" />)}
            </FormItem>
            <FormItem label="email">
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Enter the email!', min: 5 }],
              })(<Input placeholder="Enter the email!" />)}
            </FormItem>

            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <FormItem label="gender">
              {getFieldDecorator('gender', {})(
                <RadioGroup>
                  <RadioButton value="male">male</RadioButton>
                  <RadioButton value="female">female</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="institute">
              {getFieldDecorator('institute', {
                rules: [{ required: true, message: 'Enter the institute!', min: 5 }],
              })(<Input placeholder="Enter the institute!" />)}
            </FormItem>
            <FormItem label="arrivalDate">
              {getFieldDecorator('arrivalDate', {})(<DatePicker format={dateFormat} />)}
            </FormItem>
            <FormItem label="departureDate">
              {getFieldDecorator('departureDate', {})(<DatePicker format={dateFormat} />)}
            </FormItem>
            <FormItem label="room">
              {getFieldDecorator('room', {})(
                <RadioGroup>
                  <RadioButton value="single">single</RadioButton>
                  <RadioButton value="double">double</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="dietRequirement">
              {getFieldDecorator('dietRequirement', {
                rules: [{ required: true, message: 'Enter the dietRequirement!', min: 5 }],
              })(<Input placeholder="Enter the dietRequirement!" />)}
            </FormItem>
            <FormItem label="talkTitle">
              {getFieldDecorator('talkTitle', {
                rules: [{ required: true, message: 'Enter the talkTitle!', min: 5 }],
              })(<Input placeholder="Enter the talkTitle!" />)}
            </FormItem>
            <FormItem label="talkAbstract">
              {getFieldDecorator('talkAbstract', {
                rules: [{ required: true, message: 'Enter the talkAbstract!', min: 5 }],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <Button type="primary" onClick={this.updateUserInfo}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default BaseView;
