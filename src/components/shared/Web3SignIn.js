import React, { useContext } from 'react';

import { Web3ModalContext, CurrentUserContext, DefaultNetContext } from '../../contexts/Store';
import { createWeb3User, signInWithWeb3 } from '../../utils/auth';
import { Button } from 'antd';

export const Web3SignIn = () => {
  const [defaultNet] = useContext(DefaultNetContext);
  const [, setWeb3Modal] = useContext(Web3ModalContext);
  const [, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <Button
      type="default"
      size="large"
      onClick={async () => {
        try {
          const w3c = await signInWithWeb3(
            defaultNet === 'mainnet'
              ? +process.env.REACT_APP_CHAIN_ID
              : +process.env.REACT_APP_RINKEBY_CHAIN_ID
          );

          const [account] = await w3c.web3.eth.getAccounts();
          setWeb3Modal(w3c);
          const user = createWeb3User(account);
          setCurrentUser(user);
        } catch (err) {
          console.log('web3Modal error', err);
        }
      }}
    >
      Connect
    </Button>
  );
};
