const HDWalletProvider = require('@truffle/hdwallet-provider')
// const {INFURA_PROJECT_ID} = require('keys')

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",     
     port: 7545,   
     network_id: "*",    
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: "clever pen coconut sword elevator comic absent scorpion affair execute minute barely"
          },
          providerOrUrl: "wss://ropsten.infura.io/ws/v3/03b6b610e0a94fc68f9f124513c289d9",
          addressIndex: 0,
        }),
      network_id: '3',
      gas: 10000000,
      gasPrice: 20000000000, // https://etherchain.org/tools/gasnow
      confirmations: 2,  //number of blocks to wait between deployment
      timeoutBlocks: 200
    }
  },

  compilers: {
    solc: {
      version: "0.8.13",      
    }
  },
  
};
