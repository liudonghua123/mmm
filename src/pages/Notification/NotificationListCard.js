import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';

import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Card,
  Form,
  Input,
  Modal,
  Icon,
  Button,
  List,
  Row,
  Col,
  Select,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

import { isAdmin, isRead, markRead, markUnread } from '@/utils/authority';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

const FormItem = Form.Item;

@Form.create()
class NotificationFormModal extends Component {
  state = {
    record: this.props.record,
    editorState: BraftEditor.createEditorState(this.props.record.content),
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.info(`getDerivedStateFromProps: nextProps ${JSON.stringify(nextProps)}`);
  //   return {
  //     record: nextProps.record,
  //     editorState: BraftEditor.createEditorState(nextProps.record.content),
  //   };
  // }

  componentWillReceiveProps(nextProps) {
    console.info(`componentWillReceiveProps: nextProps ${JSON.stringify(nextProps)}`);
    const editorState = BraftEditor.createEditorState(nextProps.record.content);
    console.info(`editorState.toHTML(): ${editorState.toHTML()}`);
    console.info(`editorState.toRAW(): ${editorState.toRAW()}`);
    this.setState({
      record: nextProps.record,
      editorState,
    });
  }

  handleEditorChange = editorState => {
    console.info(`handleEditorChange editorState: ${JSON.stringify(editorState)}`);
    const { record } = this.state;
    record.content = editorState.toHTML();
    this.setState({ record, editorState });
  };

  render() {
    const { visible, handleFormModalVisible, form, action } = this.props;
    const { getFieldDecorator } = form;
    const { editorState } = this.state;
    const { record } = this.state;
    return (
      <Modal
        title={action}
        visible={visible}
        width={960}
        onOk={() => handleFormModalVisible(false)}
        onCancel={() => handleFormModalVisible(false)}
      >
        <Form>
          <p>{record.title}</p>
          <BraftEditor
            readOnly
            controls={[]}
            contentStyle={{ height: 'auto' }}
            value={editorState}
            onChange={this.handleEditorChange}
          />
        </Form>
      </Modal>
    );
  }
}

@connect(({ notification, loading }) => ({
  notification,
  loading: loading.models.notification,
}))
class CardList extends PureComponent {
  state = {
    record: {},
    formModalVisible: false,
    action: 'edit',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notification/fetch',
    });
  }

  handleFormModalVisible = (visible, record, action = 'edit') => {
    this.setState({
      formModalVisible: !!visible,
      record: record || {},
      action,
    });
  };

  handleMarkReadNotification = (item, read) => () => {
    // eslint-disable-next-line no-unused-expressions
    read ? markRead(item.id) : markUnread(item.id);
    this.forceUpdate();
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { notification, loading } = this.props;
    const { formModalVisible, record, action } = this.state;
    let data = [];
    if (notification.data && notification.data.notifications) {
      data = notification.data.notifications;
    }
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>Notifications</p>
      </div>
    );
    return (
      <PageHeaderWrapper title="Notification" content={content}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={data}
            renderItem={item =>
              item && (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    extra={
                      isRead(item.id) ? (
                        <Icon type="info-circle" />
                      ) : (
                        <Icon type="question-circle" theme="filled" />
                      )
                    }
                    actions={[
                      isRead(item.id) ? (
                        <Button
                          type="dashed"
                          onClick={this.handleMarkReadNotification(item, false)}
                          block
                        >
                          Mark Unread
                        </Button>
                      ) : (
                        <Button
                          type="dashed"
                          onClick={this.handleMarkReadNotification(item, true)}
                          block
                        >
                          Mark Read
                        </Button>
                      ),
                    ]}
                  >
                    <Card.Meta
                      avatar={<Icon type="notification" theme="twoTone" style={{ fontSize: 32 }} />}
                      title={<a>{item.title}</a>}
                      description={
                        <BraftEditor
                          readOnly
                          controls={[]}
                          contentStyle={{ minHeight: 150, maxHeight: 150, overflow: 'hidden' }}
                          value={BraftEditor.createEditorState(item.content)}
                        />
                      }
                      onClick={() => this.handleFormModalVisible(true, item)}
                    />
                  </Card>
                </List.Item>
              )
            }
          />
        </div>

        <NotificationFormModal
          wrappedComponentRef={this.saveFormRef}
          visible={formModalVisible}
          record={record}
          handleFormModalVisible={this.handleFormModalVisible}
          action={action}
        />
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
