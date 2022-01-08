import React, { useState } from 'react';
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { Container, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ballot from './contracts/Ballot.json';




const MetaMask_Wallet = () => {

//let state = { hasVoted: 0, web3: null, accounts: null, contract: null };


const [errorMessage, setErrorMessage] = useState(null);
const [defaultAccount, setDefaultAccount] = useState(null);
const [userBalance, setUserBalance] = useState(null);
const [connectButtonText, setConnectButtonText] = useState('Connect Wallet');

async function castVote () {
    try {
        console.log('Running deployWithEthers script...')

        const currentAccount = defaultAccount; 

        const candidateId = 0;
    
        const constructorArgs = []    // Put constructor args (if any) here for your contract

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated

        console.log(Ballot.abi)
    
        // const metadata = JSON.parse(Ballot.abi
        //     )
        // console.log(metadata);
        console.log(Ballot);


        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    
        let factory = new ethers.Contract(currentAccount, Ballot.abi, signer);
        console.log(factory);

        console.log(factory.candidates(0));

    
        console.log('Contract Address: ', factory.address);
        await factory.vote(candidateId, { from: currentAccount })

       
        

        // The contract is NOT deployed yet; we must wait until it is mined
  
        accountChangedHandler(currentAccount);
        console.log('Deployment successful.')
    } catch (e) {
        console.log(e.message)
    }
}             

// it("allows a voter to cast a vote", function() {
//     return Election.deployed().then(function(instance) {
//       electionInstance = instance;
//       candidateId = 1;
//       return electionInstance.vote(candidateId, { from: accounts[0] });
//     }).then(function(receipt) {
//       assert.equal(receipt.logs.length, 1, "an event was triggered");
//       assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
//       assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
//       return electionInstance.voters(accounts[0]);
//     }).then(function(voted) {
//       assert(voted, "the voter was marked as voted");
//       return electionInstance.candidates(candidateId);
//     }).then(function(candidate) {
//       var voteCount = candidate[2];
//       assert.equal(voteCount, 1, "increments the candidate's vote count");
//     })
//   });


async function deployContract () {
    try {
        console.log('Running deployWithEthers script...')

        let currentAccount = defaultAccount; 
    
        const constructorArgs = []    // Put constructor args (if any) here for your contract

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated

        console.log(Ballot.abi)
    
        // const metadata = JSON.parse(Ballot.abi
        //     )
        // console.log(metadata);
        console.log(Ballot);
        console.log(Ballot.deployedBytecode);

        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    
        let factory = new ethers.ContractFactory(Ballot.abi, Ballot.bytecode, signer);
    
        let contract = await factory.deploy(...constructorArgs);
    
        // The contract is NOT deployed yet; we must wait until it is mined
        await contract.deployed()
        accountChangedHandler(currentAccount);
        console.log('Deployment successful.')
    } catch (e) {
        console.log(e.message)
    }
}       







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
                    <h3>Balance: {userBalance} </h3>
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
