/*
UNICOIN PROJECT  (UNC)

By Adriel

*/

const SHA256 = require("crypto-js/sha256");
const prompt = require("prompt-sync")({ sigint: true });
const util = require("util"); // helps us log nested objects

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
      this.indx + +this.timestamp + JSON.stringify(this.blockData) + this.nonce
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
  constructor(levelOfDifficulty = 0) {
    this.blockchain = [this.generateGenesisBlock()];
    this.levelOfDifficulty = levelOfDifficulty;
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
      if (curBlock.prevBlockHash !== prevBlock.findBlockHash()) {
        return false;
      }
    }

    // blockchain is valid
    return true;
  }
}

// RUNNING THE UNICOIN BLOCKCHAIN
let unicoinBlockChain = new UnicoinBlockChain(3);

console.log("Welcome to the Unicoin Blockchain ......");
console.log("Start Recording Transactions");

// Terminal Prompt
counter = 0;
while (true) {
  const sender = prompt("Sender: >");
  const receiver = prompt("Receiver: >");
  const amount = Number(prompt("Amount: >"));

  if (sender && receiver && amount) {
    const newBlock = new UnicoinBlock(counter, new Date().getTime(), {
      sender: "Aimable",
      receiver: "Adriel",
      amounT: 0.00015,
    });
    unicoinBlockChain.addNewBlock(newBlock);
    counter++;
    console.log("-----------");
    console.log("New Block Successfully Added");
    console.log(util.inspect(unicoinBlockChain, { depth: null }));
  } else {
    console.log("Incomplete or incorrect transaction data, try again");
  }
}
