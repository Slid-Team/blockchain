/*
UNICOIN PROJECT  (UNC)

By Adriel

*/

const SHA256 = require("crypto-js/sha256");
const prompt = require("prompt-sync")({ sigint: true });

// Unicoin Block
class UnicoinBlock {
  constructor(indx, timestamp, blockData, prevBlockHash = "") {
    this.indx = indx;
    this.timestamp = timestamp;
    this.blockData = blockData;
    this.prevBlockHash = prevBlockHash;
    this.blockHash = this.findBlockHash();
    this.nonce = 0;
  }

  findBlockHash() {
    return SHA256(
      this.indx + this.timestamp + JSON.stringify(this.blockData) + this.nonce
    ).toString();
  }

  proofOfWork(levelOfDifficulty) {
    console.log("Proof of work initiated...");
    let count = 1;
    while (
      this.blockHash.substring(0, levelOfDifficulty) !==
      "c".repeat(levelOfDifficulty)
    ) {
      console.log(`${count}: ${this.blockHash}`);
      count++;
      this.nonce = this.nonce + 1;
      this.blockHash = this.findBlockHash();
    }
  }
}

// class Unicoin Blockchain
class UnicoinBlockChain {
  constructor(levelOfDifficulty = 0, stepsForRaisingDifficulty = 5) {
    this.blockchain = [this.generateGenesisBlock()];
    this.lastLengthWhereDifficultyWasIncreased = 0; // we want to be increasing difficulty by 1 after every n blocks mined
    this.levelOfDifficulty = levelOfDifficulty;
    this.stepsForRaisingDifficulty = stepsForRaisingDifficulty; // after how many blocks to we increase the difficulty level
  }

  generateGenesisBlock() {
    return new UnicoinBlock(0, new Date().getTime(), "GENESIS BLOCK", "0");
  }

  getLastBlock() {
    const blockchainLength = this.blockchain.length;
    return this.blockchain[blockchainLength - 1];
  }

  addNewBlock(newUnicoinBlock) {
    // point the new block to the last block in the blockchain
    newUnicoinBlock.prevBlockHash = this.getLastBlock().blockHash;

    // compute the hash for the new block, that satisfies the requirements
    newUnicoinBlock.proofOfWork(this.levelOfDifficulty);

    // add the block to the blockchain
    this.blockchain.push(newUnicoinBlock);

    if (!this.validateBlockchain()) {
      console.log("Block denied, clockchain invalid");
      this.blockchain.pop();
    } else {
      console.log("block added");

      // check if we need to increase difficulty
      const curBlockchainLength = this.blockchain.length;
      if (
        curBlockchainLength - this.lastLengthWhereDifficultyWasIncreased >
        this.stepsForRaisingDifficulty
      ) {
        this.levelOfDifficulty += 1;
        this.lastLengthWhereDifficultyWasIncreased = curBlockchainLength;
        console.log(`Mining difficulty updated to ${this.levelOfDifficulty}`);
      }
      console.log(this.blockchain);
    }
  }

  validateBlockchain() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const curBlock = this.blockchain[i];
      const prevBlock = this.blockchain[i - 1];

      // block has been tampered
      if (curBlock.blockHash !== curBlock.findBlockHash()) {
        return false;
      }

      // block not in its correct position
      if (curBlock.prevBlockHash !== prevBlock.blockHash) {
        return false;
      }
    }

    // blockchain is valid
    return true;
  }
}

// RUNNING THE UNICOIN BLOCKCHAIN
let unicoinBlockChain = new UnicoinBlockChain(1, 2);

console.log("Welcome to the Unicoin Blockchain ......");
console.log("Start Recording Transactions");

// Terminal Prompt
counter = 1;
while (true) {
  const sender = prompt("Sender: >");
  const receiver = prompt("Receiver: >");
  const amount = Number(prompt("Amount: >"));

  if (sender && receiver && amount) {
    const newBlock = new UnicoinBlock(counter, new Date().getTime(), {
      sender: "Aimable",
      receiver: "Adriel",
      amount: 0.00015,
    });
    unicoinBlockChain.addNewBlock(newBlock);
    counter++;
    console.log("-----------");
  } else {
    console.log("Incomplete or incorrect transaction data, try again");
  }
}
