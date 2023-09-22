require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.17",
  networks: {
    eosevm: {
      url: "https://api.evm.eosnetwork.com",
      accounts:[`0x${process.env.PRIVATE_KEY}`],
    },
    eosevm_testnet: {
      url: "https://api.testnet.evm.eosnetwork.com",
      accounts:[`0x${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      chainId: 80001,
      url: `${process.env.ALCHEMY_MUMBAI_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
