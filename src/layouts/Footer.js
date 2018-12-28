import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Yunnan University',
          title: 'Yunnan University',
          href: 'http://www.ynu.edu.cn',
          blankTarget: true,
        },
        {
          key: 'International cooperation and exchange office of Yunnan University',
          title: 'International cooperation and exchange office of Yunnan University',
          href: 'http://www.eniep.ynu.edu.cn/',
          blankTarget: true,
        },
        {
          key: 'help',
          title: 'Help',
          href: '/help',
          blankTarget: false,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 Center of Information Technology of Yunnan
          University
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
