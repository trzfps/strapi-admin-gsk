/**
 *
 * Logout
 *
 */

/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { request } from 'strapi-helper-plugin';
import { get } from 'lodash';
import { auth } from 'strapi-helper-plugin';
import Wrapper from './components';

const Logout = ({ history: { push } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleGoToMe = () => {
    push({
      pathname: `/me`,
    });
  };

  const handleLogout = async () => {
    const requestURL = '/admin/logout';
    await request(requestURL, { method: 'POST' });
    auth.clearAppStorage();
    push('/auth/login');
  };

  const getUserInfo = async () => {
    const requestURL = '/admin/users/me';
    const result = await request(requestURL, { method: 'GET' });
    setUserInfo(result.data);

  }

  const toggle = () => setIsOpen(prev => !prev);

  const displayName =
    userInfo && userInfo.firstname && userInfo.lastname
      ? `${userInfo.firstname} ${userInfo.lastname}`
      : get(userInfo, 'username', '');

  return (
    <Wrapper>
      <ButtonDropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle>
          {displayName}
          <FontAwesomeIcon icon="caret-down" />
        </DropdownToggle>
        <DropdownMenu className="dropDownContent">
          <DropdownItem onClick={handleGoToMe} className="item">
            <FormattedMessage id="app.components.Logout.profile" />
          </DropdownItem>
          <DropdownItem onClick={handleLogout}>
            <FormattedMessage id="app.components.Logout.logout" />
            <FontAwesomeIcon icon="sign-out-alt" />
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </Wrapper>
  );
};

export default withRouter(Logout);
