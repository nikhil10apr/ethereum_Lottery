import Web3 from 'web3';

const contractJSON = require('../../build/contracts/Lottery.json');

class Web3Service {
  constructor(address) {
    this.nodeUrl = 'http://127.0.0.1:7545';
    this.connectToNode();
    this.loadContract(address);
  }

  connectToNode() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
  }

  loadContract(address) {
  	this.contract = new this.web3.eth.Contract(contractJSON.abi, '0x4cFAC48A9C06C37ff20277Fa6a5571181Df423ba');
  }
}

export default new Web3Service();
