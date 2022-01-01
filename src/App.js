import './App.css';
import React from 'react'
import MetaMask_Wallet from './MetaMask_Wallet';
import Ballot from './Ballot'
import Select from 'react-select'
import Vote from './Vote';

//let metaMaskConnected = false;
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]



function App() {
  return (
    <div className="App">
      <MetaMask_Wallet/>
      <Ballot/>
      <Select options={options} />
      <Vote/>
    </div>
  );
}

export default App;
