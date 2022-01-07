import React, { useState } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { Container, Form } from 'react-bootstrap';




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

const castVote = () => {
    console.log('vote');
}

const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    console.log("account");
    getUserBalance(newAccount.toString());
}

const getUserBalance = (address) => {
    window.ethereum.request({method: 'eth_getBalance', params:[address, 'latest']})
    .then(balance => {
        console.log(ethers.utils.formatEther(balance));
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
            <br />  
            <Container>

                <h4> {"Connection to MetaMask"} </h4>

                <Button onClick={connectWalletHandler}>{connectButtonText}</Button>

                <div className='accountDisplay'>
                    <h3>Voter Address: {defaultAccount}</h3>
                </div>

                <div className='balanceDisplay'>
                    <h3>Balance: {userBalance}</h3>
                </div>


                <div className="Ballot_Table">
                    <Table striped bordered hover   style={{width: 400}}>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Canididate</th>
                            <th>Vote Tally</th>
                            </tr>
                        </thead>
                        <tbody>

                        {/* line split */}
                            <tr>
                            <td>1</td>
                            <td></td>
                            <td></td>
                            </tr>


                        {/* line split */}
                            <tr>
                            <td>2</td>
                            <td></td>
                            <td></td>

                            </tr>
                        </tbody>
                    </Table>
                </div>
                <br />  

                <div>
                    <Form.Select>
                        <option></option>
                    </Form.Select>
                </div>
                <br />  



                <div>
                    <Button onClick={castVote} variant="success">Vote</Button>{' '}
                </div>
                
                {errorMessage}
                </Container> 
                <br />  
		</div>
	);
}

export default MetaMask_Wallet;
