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
  	this.contract = new this.web3.eth.Contract(contractJSON.abi, '0x02Bfd947ba8eF1Fbb6AB7516EDa824e896cCE8e9');
  }
}

export default new Web3Service();
