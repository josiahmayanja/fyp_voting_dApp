import React, { useState } from 'react';
import { ethers } from 'ethers';



const MetaMask_Wallet = () => {


const [errorMessage, setErrorMessage] = useState(null);
const [defaultAccount, setDefaultAccount] = useState(null);
const [userBalance, setUserBalance] = useState(null);
const [connectButtonText, setConnectButtonText] = useState('Connect Wallet');

const connectWalletHandler = () => {

    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log('MetaMask Here!');

        window.ethereum.request({ method: 'eth_requestAccounts'})
        .then(result => {
            console.log('The active account is ' + result[0]);
            accountChangedHandler(result[0]);
            setConnectButtonText('Wallet Connected');
            getUserBalance(result[0]);
        })
        .catch(error => {
            setErrorMessage(error.message);
        
        });

    } else {
        console.log('Need to install MetaMask browser extension');
        setErrorMessage('Please install MetaMask browser extension to interact with page');
    }
}


const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
}

const getUserBalance = (address) => {
    window.ethereum.request({method: 'eth_getBalance', params:[address, 'latest']})
    .then(balance => {
        setUserBalance(ethers.utils.formatEther(balance));
    })
}

const chainChangedHandler = () => {
    window.location.reload();
}

window.ethereum.on('accountsChanged', accountChangedHandler);

window.ethereum.on('chainChanged', chainChangedHandler);


    return (
		<div className='Wallet'>
		<h4> {"Connection to MetaMask"} </h4>
			<button onClick={connectWalletHandler}>{connectButtonText}</button>
			<div className='accountDisplay'>
				<h3>Voter Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
			{errorMessage}
		</div>
	);
}

export default MetaMask_Wallet;
