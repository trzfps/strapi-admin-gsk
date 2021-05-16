/**
 *
 * Logout
 *
 */

/* eslint-disable */
import React, { useState, useEffect } from 'react';
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
  const [userInfo, setUserInfo] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
    useEffect(
        () => {

            const isLogin = async () => {
                try {
                  const requestUrl = "/admin/users/me";
                  const result = await request(requestUrl, { method: 'GET' });
                  console.log(result);
                  setUserInfo(result.data);
                } catch (e) {
                    console.log(e);
                }
                setLoadingComplete(true);
            }   
            isLogin();
        },
        []
    );

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

  const toggle = () => setIsOpen(prev => !prev);

  
  if(loadingComplete){
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

  }

};

export default withRouter(Logout);
