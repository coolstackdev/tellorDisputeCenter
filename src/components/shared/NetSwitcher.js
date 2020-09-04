import React, { useEffect, useContext } from 'react';

import { Switch } from 'antd';
import { DefaultNetContext } from 'contexts/Store';

const NetSwitcher = () => {
  const [defaultNet, setDefaultNet] = useContext(DefaultNetContext);

  useEffect(() => {
    setDefaultNet(localStorage.getItem('defaultNet'));
  }, []);

  const switchDefaultNet = (checked) => {
    const netMode = checked ? 'mainnet' : 'rinkeby'

    setDefaultNet(netMode);
    window.localStorage.setItem('defaultNet', netMode);
  };

  return (
    <>
      <Switch
        checkedChildren="Mainnet"
        unCheckedChildren="Rinkeby"
        checked={defaultNet === 'mainnet'}
        onClick={(checked) => switchDefaultNet(checked)} />
    </>
  );
};

export default NetSwitcher;
