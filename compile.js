const path = require("path");
const fs = require("fs");
const solc = require("solc");

module.exports = (address) => {
  const contractPath = path.resolve(__dirname, "contracts", "Token.sol");
  const outputPath = path.resolve(__dirname, "outputs", "Token.sol");

  const contractContent = fs
    .readFileSync(contractPath, "utf8")
    .toString()
    .split("__TOKEN_NAME__")
    .join(process.env.TOKEN_NAME)
    .split("__TOKEN_SYMBOL__")
    .join(process.env.TOKEN_SYMBOL)
    .split("__DATE_DEPLOY__")
    .join(new Date().toDateString())
    .split("__WEBSITE__")
    .join(process.env.WEBSITE)
    .split("__FAIRLAUNCH__")
    .join(process.env.FAIRLAUNCH)
    .split("__DEVADDRESS__")
    .join(address);

  var input = {
    language: "Solidity",
    sources: {
      "Token.sol": { content: contractContent },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  var output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (typeof output.contracts["Token.sol"] !== "undefined") {
    fs.writeFileSync(outputPath, contractContent);
  }

  return output.contracts["Token.sol"][process.env.TOKEN_SYMBOL];
};
