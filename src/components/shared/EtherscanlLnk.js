import React, { useContext } from 'react';
import { DefaultNetContext } from 'contexts/Store';


const EtherscanLink = ({ txHash }) => {
  const [defaultNet] = useContext(DefaultNetContext);

  const uri = defaultNet === 'mainnet'
      ? 'https://etherscan.io/tx/'
      : 'https://rinkeby.etherscan.io/tx/';

  return (
    <div>
      <a href={`${uri}${txHash}`} target="_blank" rel="noopener noreferrer">
        View on Etherscan
      </a>
    </div>
  );
};

export default EtherscanLink;
