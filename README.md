# Voting dApp on the Rinkeby Network

This project aims to create a secure, decentralized voting system leveraging blockchain technology to combat electoral fraud. The dApp allows users to deploy a smart contract with candidate names and their corresponding Ethereum addresses on the Rinkeby test network. Voters can then cast their votes securely via the app.

The front end is built with **React**, and the Ethereum smart contracts are developed using **Solidity** and the **Truffle framework**. Unit tests are written in **Mocha**.

[![GitHub issues](https://img.shields.io/github/issues/josiahmayanja/fyp_voting_dApp)](https://github.com/josiahmayanja/fyp_voting_dApp/issues)
[![GitHub license](https://img.shields.io/github/license/josiahmayanja/fyp_voting_dApp)](https://github.com/josiahmayanja/fyp_voting_dApp)
[![GitHub forks](https://img.shields.io/github/forks/josiahmayanja/fyp_voting_dApp)](https://github.com/josiahmayanja/fyp_voting_dApp/network)
[![GitHub stars](https://img.shields.io/github/stars/josiahmayanja/fyp_voting_dApp)](https://github.com/josiahmayanja/fyp_voting_dApp/stargazers)

---

## Prerequisites

- **npm**: `>=8.1.2`
- **node**: `>16.13.1`
- **MetaMask**: Install and create an account ([MetaMask Download](https://metamask.io/))
- **Blockchain Node**: Configure a node connection (e.g., [Moralis](https://moralis.io/))

### Setting Up

1. Add your MetaMask mnemonic (12-word phrase) to `secrets.js`.
2. Obtain a Moralis Speedy Node endpoint for the Rinkeby network:
   - Log into [Moralis](https://moralis.io/).
   - Navigate to **Speedy Nodes** > **ETH Network** and copy the Rinkeby URL (e.g., `https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXX/eth/rinkeby`).
3. Replace the URL in the `truffle-config.js` file:

   ```javascript
   rinkeby: {
     provider: () =>
       new HDWalletProvider(
         mnemonic,
         `https://speedy-nodes-nyc.moralis.io/XXXXXXXXX/eth/rinkeby`
       ),
     network_id: 4, // Rinkeby's ID
     gas: 5500000, // Block limit
     confirmations: 2, // Confirmations before deployment
     timeoutBlocks: 200, // Deployment timeout
     skipDryRun: true, // Skip dry-run
   },
   ```

4. Acquire test ETH for transactions from [Chainlink Faucet](https://faucets.chain.link/rinkeby).
5. Use [Rinkeby Etherscan](https://rinkeby.etherscan.io) to verify transactions with the hash provided in the console log.

---

## Running the Project

1. Clone the repository.
2. Navigate to the project folder in your terminal.
3. Start the application:

   ```bash
   npm run start
   ```

The app will launch at [http://localhost:3000](http://localhost:3000).

---

## Running on Local Ganache

To test on a local Ganache instance:

1. Open Ganache and set the following server configuration:
   - **Hostname**: `127.0.0.1`
   - **Port**: `7545`
   - **Network ID**: `5777`

2. Update the `truffle-config.js` file for development:

   ```javascript
   development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*", // Match any network ID
   },
   ```

3. Configure MetaMask for local testing:
   - Navigate to **Settings > Networks > Add Network** and input:
     - **Network Name**: Localhost
     - **New RPC URL**: `http://127.0.0.1:7545`
     - **Chain ID**: `1337`
     - **Currency Symbol**: ETH (optional)

---

## Running Unit Tests

Unit tests are written in the `test/ballot.js` file using the Mocha framework.

Run tests with:

```bash
truffle test
```

For additional debugging information:

```bash
truffle test --stacktrace-extra
```

---

## Contributing

Contributions are welcome! Please create an issue to discuss significant changes before submitting a pull request.

### Contact

For questions, email: [jmayanja.xyz@gmail.com](mailto:jmayanja.xyz@gmail.com)

---

## Demo

![dApp Video Demo](https://github.com/user-attachments/assets/07a739ff-2d01-463c-b8cc-e33ce4187a2e)
