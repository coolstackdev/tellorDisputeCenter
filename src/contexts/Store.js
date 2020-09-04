import React, { useState, useEffect, createContext } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';

import { w3connect, providerOptions, createWeb3User } from '../utils/auth';
import { getChainData } from '../utils/chains';
import TellorService from 'utils/tellorService';
import tellorLoaderDark from '../assets/Tellor__Loader--Dark.json';
import tellorLoaderLight from '../assets/Tellor__Loader--Light.json';

export const ContractContext = createContext();
export const OpenDisputesContext = createContext();
export const CurrentUserContext = createContext();
export const Web3ModalContext = createContext();
export const ModeContext = createContext();
export const DefaultNetContext = createContext();

const Store = ({ children }) => {
  const [contract, setContract] = useState();
  const [openDisputes, setOpenDisputes] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [mode, setMode] = useState(
    window.localStorage.getItem('viewMode') === 'light'
      ? tellorLoaderLight
      : tellorLoaderDark,
  );
  const [defaultNet, setDefaultNet] = useState(
    window.localStorage.getItem('defaultNet') === 'rinkeby'
      ? 'rinkeby'
      : 'mainnet',
  );
  const [web3Modal, setWeb3Modal] = useState(
    new Web3Modal({
      network: getChainData(
        defaultNet === 'mainnet' 
          ? +process.env.REACT_APP_CHAIN_ID
          : +process.env.REACT_APP_RINKEBY_CHAIN_ID
        ).network, // optional
      providerOptions, // required
      cacheProvider: true,
    }),
  );

  useEffect(() => {
    const initCurrentUser = async () => {
      try {
        const w3c = await w3connect(
          web3Modal,
          defaultNet === 'mainnet'
            ? +process.env.REACT_APP_CHAIN_ID
            : +process.env.REACT_APP_RINKEBY_CHAIN_ID
        );
        setWeb3Modal(w3c);

        const [account] = await w3c.web3.eth.getAccounts();
        let user = createWeb3User(account);
        setCurrentUser(user);
      } catch (e) {
        console.error(`Could not log in with web3`);
      }
    };

    if (web3Modal.cachedProvider) {
      initCurrentUser();
    }
  }, [web3Modal, currentUser, defaultNet]);

  useEffect(() => {
    const initContract = async (web3) => {
      try {
        const tellorService = new TellorService(
          web3,
          defaultNet === 'mainnet'
            ? process.env.REACT_APP_TELLOR_CONTRACT_ADDRESS
            : process.env.REACT_APP_RINKEBY_TELLOR_CONTRACT_ADDRESS
        );
        await tellorService.initContract();
        const disputeFee = await tellorService.getDisputeFee();
        setContract({ service: tellorService, disputeFee });
      } catch (e) {
        console.error(`Could not init contract`);
      }
    };

    initContract(web3Modal.web3 || new Web3(defaultNet === 'mainnet' ? process.env.REACT_APP_INFURA_URI : process.env.REACT_APP_RINKEBY_INFURA_URI));
  }, [web3Modal, defaultNet]);

  useEffect(() => {
    const initCurrentUserBalance = async () => {
      try {
        const balance = await contract.service.getBalance(currentUser.username);
        const updatedUser = { ...currentUser, balance };
        setCurrentUser(updatedUser);
      } catch (e) {
        console.error(`Could not get balance`);
      }
    };

    if (contract && currentUser && !currentUser.hasOwnProperty('balance')) {
      initCurrentUserBalance();
    }
  }, [currentUser, contract]);

  return (
    <Web3ModalContext.Provider value={[web3Modal, setWeb3Modal]}>
      <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
        <ModeContext.Provider value={[mode, setMode]}>
          <DefaultNetContext.Provider value={[defaultNet, setDefaultNet]}>
            <ContractContext.Provider value={[contract, setContract]}>
              <OpenDisputesContext.Provider
                value={[openDisputes, setOpenDisputes]}
              >
                {children}
              </OpenDisputesContext.Provider>
            </ContractContext.Provider>
          </DefaultNetContext.Provider>
        </ModeContext.Provider>
      </CurrentUserContext.Provider>
    </Web3ModalContext.Provider>
  );
};

export default Store;
