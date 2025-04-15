require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.29",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    edutest: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      chainId: 656476,
      accounts: [process.env.PRIVATE_KEY],
    },
    edu: {
      url: "https://rpc.edu-chain.raas.gelato.cloud",
      chainId: 41923,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
