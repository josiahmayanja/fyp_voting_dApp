import './App.css';
import React from 'react'
import MetaMask_Wallet from './MetaMask_Wallet';
import { ethers } from 'ethers';
import { Card } from 'react-bootstrap';


// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()

var contractAddress = '0xc864D0fef177A69aFa8E302A1b90e450910A4c3E';
var abi = JSON.parse( '[{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_info","type":"string"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]' );


// let contract;

// const web3 = new Web3(window.ethereum);

// const networkId = await web3.net.getId();
// const smartContract = new web3.eth.Contract(BallotsContract.abi, )

<Card>
  <Card.Header></Card.Header>
</Card>

function App() {
  return (
    <div className="App">
       <br />
    <Card>
     <MetaMask_Wallet/>
    </Card>
    <br />
    </div>
  );
}

export default App;
