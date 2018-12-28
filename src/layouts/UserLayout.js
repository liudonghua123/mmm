import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const links = [
  {
    key: 'YNU',
    title: formatMessage({ id: 'layout.user.link.ynu' }),
    href: 'http://www.ynu.edu.cn/',
  },
  {
    key: 'international',
    title: formatMessage({ id: 'layout.user.link.international' }),
    href: 'http://www.sie.ynu.edu.cn/',
  },
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '/help',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 Center of Information Technology of Yunnan University
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Meeting Member Management System</span>
              </Link>
            </div>
            <div className={styles.desc}>Some description here</div>
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
