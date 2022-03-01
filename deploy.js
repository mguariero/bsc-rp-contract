require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compile = require("./compile");

const provider = new HDWalletProvider(
  process.env.PRIVATE_KEY,
  process.env.RPC_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const contractCompiled = compile(accounts[0]);

  console.log("Attempting to deploy from account: ", accounts[0]);

  const result = await new web3.eth.Contract(contractCompiled.abi)
    .deploy({ data: contractCompiled.evm.bytecode.object })
    .send({ from: accounts[0] });

  console.log("Contract deployed to: ", result.options.address);
};

deploy();
