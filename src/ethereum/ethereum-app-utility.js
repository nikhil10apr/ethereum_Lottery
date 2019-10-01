import Web3 from 'web3';

const contractJSON = require('../../build/contracts/Lottery.json');

class Web3Service {
  constructor(address) {
    this.nodeUrl = 'ws://127.0.0.1:7545';
    this.connectToNode();
    this.loadContract(address);
  }

  connectToNode() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.nodeUrl));
  }

  loadContract(address) {
  	this.contract = new this.web3.eth.Contract(contractJSON.abi, '0x2AAD33eaF6fd56818830CEa644B3e3E0b6E97be4');
  }
}

export default new Web3Service();
