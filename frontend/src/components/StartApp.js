import web3 from "web3";
import cryptoZombiesABI from "cryptozombies_abi.js"; // replace when ABI will be created

let cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";
cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
