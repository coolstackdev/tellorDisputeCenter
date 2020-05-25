import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const VoteButton = ({ value }) => {
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleSubmit = async () => {
    setProcessing(true);
    setTimeout(() => {
      // setVisible(false);
      setProcessing(false);
      setProcessed(true);
    }, 3000);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const renderTitle = () => {
    if (processing) {
      return 'Sending Vote';
    } else if (processed) {
      return 'Sent Vote';
    } else {
      return 'Vote';
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Vote
      </Button>
      <Modal
        visible={visible}
        title={renderTitle()}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={null}
      >
        {!processing && !processed ? (
          <>
            <p>Stake some TRB to dispute a value</p>
            <p>Symbol</p>
            <p>temp</p>
            <p>Value</p>
            <p>{value.value}</p>
            <p>Your Voting Power</p>
            <p>temp</p>
            <Button
              key="support"
              type="primary"
              // loading={loading}
              onClick={handleSubmit}
            >
              Support
            </Button>
            ,
            <Button
              key="challenge"
              type="secondary"
              // loading={loading}
              onClick={handleSubmit}
            >
              Challenge
            </Button>
          </>
        ) : null}

        {processing ? (
          <>
            <p>loading</p>
            <p>View on Etherscan</p>
          </>
        ) : null}

        {processed ? (
          <>
            <p>big checkmark</p>
            <p>View on Etherscan</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default VoteButton;
