import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import { Container, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ballot from './contracts/Ballot.json';


const MetaMask_Wallet = () => {

const [errorMessage, setErrorMessage] = useState(null);
const [defaultAccount, setDefaultAccount] = useState(null);
const [userBalance, setUserBalance] = useState(null);
const [connectButtonText, setConnectButtonText] = useState('Connect Wallet');

const [data, setData] = useState(undefined);

let contractAddress;


async function getVote() {
    let add = "0xC0c8F83e7f3Fb1Db81778587a8b0ae1D35Fa005D";
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    let factory = new ethers.Contract(add, Ballot.abi, signer);

    try {
        const data = await factory.getCandidatesCount()
        console.log(data.toString());
    } catch (err) {
        console.log("Error: ", err);
    }   
}





async function addCanididate() {
    try {
        console.log('Running deployWithEthers script...')

        const currentAccount = defaultAccount; 

        console.log(contractAddress);
        let add = "0xC0c8F83e7f3Fb1Db81778587a8b0ae1D35Fa005D";


        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

        console.log(add);
        let factory = new ethers.Contract(add, Ballot.abi, signer);

        const tx = await factory.addCandidate("Aguero");
        const receipt = await tx.wait();
        console.log(receipt);
        
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  
        accountChangedHandler(currentAccount);
        console.log('Deployment successful.');
        getVote()
    } catch (e) {
        console.log(e.message)
    }
}        




async function deployContract () {
    try {
        console.log('Running deployWithEthers script...')

        let currentAccount = defaultAccount; 

    
        const constructorArgs = [
        
        ]    // Put constructor args (if any) here for your contract

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated

        console.log(Ballot.abi);
        
        const FormatTypes = ethers.utils.FormatTypes;

        const iface = new ethers.utils.Interface(Ballot.abi);
        console.log(iface);
        iface.format(FormatTypes.full);

        console.log(iface);
       // check this out
        console.log(iface._abiCoder);


    

        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    
        let factory = new ethers.ContractFactory(Ballot.abi, Ballot.bytecode, signer);
    
        let contract = await factory.deploy(...constructorArgs);
    
        // The contract is NOT deployed yet; we must wait until it is mined
        const tx = await contract.deployed()
        contractAddress = tx.address;
        console.log(contractAddress);
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
                            <td>{data}</td>
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
                <br/>  

                <div>
                    <Form.Select>
                        <option></option>
                    </Form.Select>
                </div>
                <br/>  

                <div>
                    <Button onClick={deployContract} variant="secondary">Deploy Contract</Button>{' '}
                </div>

                <br/> 



                <div>
                    <Button onClick={addCanididate} variant="warning">Add Candidate</Button>{' '}
                </div>
                
                {errorMessage}
                </Container> 
                <br/>  
		</div>
	);
}

export default MetaMask_Wallet;
