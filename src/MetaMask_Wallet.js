import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Container,
  Form,
  Navbar,
  Card,
  Stack,
  Button,
  Table,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Ballot from "./contracts/Ballot.json";

const MetaMask_Wallet = () => {
  //Metamask
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [contractAddress, setContractAddress] = useState(null);

  //Ballot Form
  const [ballotProposal, setBallotProposal] = useState("");
  const [isProposalFormTextValid, setIsProposalTextValid] = useState(false);
  const [isPropsalSubmitted, setIsProposalSubmitted] = useState(false);

  //candidate arrays
  const [candidateNameArray, setCandidateNameArray] = useState([]);
  const [candidateAddressArray, setCandidateAddressArray] = useState([]);

  //candidate forms
  const [candidateName, setCandidateName] = useState("");
  const [candidateEthAddress, setCandidateEthAddress] = useState("");

  //canidate form validations
  const [isCandidateFormTextValid, setIsCandidateFormTextValid] =
    useState(false);

  const [isCandidateFormAddressValid, setIsCandidateFormAddressValid] =
    useState(false);

  const [isCandidateInputsValid, setIsCandidateInputsValid] = useState(false);

  const [isCandidateFormSubmitted, setIsCandidateFormSubmitted] =
    useState(false);

  //Table

  const [table, setTable] = useState([]);

  const [voteNumber, setVoteNumber] = useState("");

  const [isContractDeployed, setIsContractDeployed] = useState(false);

  const getCandidates = async (txAddress) => {
    try {
      console.log("Retreive Candidate information from deployed contract...");

      const currentAccount = defaultAccount;

      console.log(contractAddress);

      let factory;

      if (contractAddress) {
        const signer = new ethers.providers.Web3Provider(
          window.ethereum
        ).getSigner();
        factory = new ethers.Contract(contractAddress, Ballot.abi, signer);
      } else {
        const signer = new ethers.providers.Web3Provider(
          window.ethereum
        ).getSigner();
        factory = new ethers.Contract(txAddress, Ballot.abi, signer);
      }

      const tx = await factory.getCandidates();

      let tally = [];
      let obj = [];

      tx[1].forEach((element) => tally.push(element.toNumber()));
      console.log(tally);

      tx[0].forEach((element) =>
        obj.push([element, tally[tx[0].indexOf(element)]])
      );
      console.log(obj);

      console.log(Array.isArray(obj));

      setTable(obj);
      ballotWinner(obj);
      setVoteNumber("0");
      accountChangedHandler(currentAccount);
      console.log("Successfully retreived information");
    } catch (e) {
      console.log(e.message);
    }
  };

  const [winner, setWinner] = [];

  const deploySmartContract = async () => {
    try {
      console.log("Deploying smart contract...");

      let currentAccount = defaultAccount;

      const signer = new ethers.providers.Web3Provider(
        window.ethereum
      ).getSigner();
      let factory = new ethers.ContractFactory(
        Ballot.abi,
        Ballot.bytecode,
        signer
      );

      const contract = await factory.deploy(candidateNameArray, ballotProposal);

      const tx = await contract.deployed();

      console.log("Contract Address: ", tx.address);
      setContractAddress(tx.address);
      console.log(contractAddress);
      accountChangedHandler(currentAccount);
      console.log("...Deployment successful");
      getCandidates(tx.address);
      setIsContractDeployed(true);
    } catch (e) {
      console.log(e.message);
    }
  };

  const voteCandidate = async () => {
    try {
      console.log("Adding vote to smart contract...");

      const currentAccount = defaultAccount;

      console.log(contractAddress);

      const signer = new ethers.providers.Web3Provider(
        window.ethereum
      ).getSigner();
      let factory = new ethers.Contract(contractAddress, Ballot.abi, signer);

      console.log(parseInt(voteNumber));
      console.log(typeof parseInt(voteNumber));

      const tx = await factory.vote(parseInt(voteNumber));
      await tx.wait();

      accountChangedHandler(currentAccount);
      console.log("Vote successful.");
      getCandidates();
    } catch (e) {
      console.log(e.message);
    }
  };

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          console.log("The active account is " + result[0]);
          accountChangedHandler(result[0]);
          setConnectButtonText("Wallet Connected to Metamask");
          getUserBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask browser extension");
      setErrorMessage(
        "Please install MetaMask browser extension to interact with page"
      );
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  };

  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        console.log(ethers.utils.formatEther(balance));
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  const chainChangedHandler = () => {
    window.location.reload();
    connectWalletHandler();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const propsalTextHandler = (event) => {
    if (typeof event.target.value === "string" && event.target.value) {
      setBallotProposal(event.target.value);
      setIsProposalTextValid(true);
    } else {
      setBallotProposal(null);
      setIsProposalTextValid(false);
    }
  };

  const candidateTextHandler = (event) => {
    setCandidateName(event.target.value);

    if (typeof event.target.value === "string" && event.target.value) {
      setIsCandidateFormTextValid(true);
    } else {
      setIsCandidateFormTextValid(false);
    }
  };

  const candidateEthAddressHandler = (event) => {
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    const isEthValid = ethRegex.test(event.target.value);

    setCandidateEthAddress(event.target.value);

    if (isEthValid && event.target.value) {
      setIsCandidateFormAddressValid(true);
      console.log(isCandidateFormAddressValid);
    } else {
      setIsCandidateFormAddressValid(false);
    }
  };

  const submitProposal = () => {
    console.log("Ballot Proposal Name: ", ballotProposal);
    setIsProposalSubmitted(true);
  };

  const submitCandidateName = () => {
    console.log("Submitting candidate names");
    setIsCandidateFormSubmitted(true);
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    console.log(typeof e.target.value);
    setVoteNumber(e.target.value);
  };

  const addCandidate = () => {
    const array = candidateNameArray;

    // let doesNameExist = false;

    // while (doesNameExist == false) {
    //     for (let index = 0; index < array.length; index++) {
    //       if (array[index] == candidateForm) {
    //         doesNameExist = true;
    //       }
    //     }
    // }

    array.push(candidateName);
    setCandidateNameArray(array);
    console.log(candidateNameArray);
    setCandidateName("");
    setCandidateEthAddress("");
  };

  const ballotWinner = () => {
    let highest = 0;
    let candidate = [];

    //find highest vote tally
    table.array.forEach((element) => {
      if (element[1] > highest) {
        highest = element[1];
      }
    });

    //find candiadate(s) that match tally
    table.array.forEach((element) => {
      if (element[1] == highest) {
        candidate.push(element[0]);
      }
    });

    console.log(candidate.length);

    setWinner(candidate);

    // if (candidate.length > 1) {
    //   return console.log(candidate[0]);
    // } else {
    //   return console.log("tied at: ", candidate);
    // }
  };

  return (
    <div className="Wallet">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">E-Voting Dapp</Navbar.Brand>
        </Container>
      </Navbar>

      <br />

      <Container>
        <Card bg="light" className="text-center">
          <Card.Header>MetaMask Wallet Connection</Card.Header>
          <Card.Body>
            <Card.Text>Account Address: {defaultAccount}</Card.Text>
            <Card.Text>Balance: {userBalance} </Card.Text>
            <Button variant="primary" onClick={connectWalletHandler}>
              {connectButtonText}
            </Button>
          </Card.Body>
        </Card>

        <br />

        {!isContractDeployed ? (
          <div>
            <Card bg="light" className="text-center">
              <Card.Header>Add Ballot Proposal</Card.Header>
              <Card.Body>
                {!isPropsalSubmitted ? (
                  <div>
                    <Stack direction="horizontal" gap={3}>
                      <Form.Control
                        type="text"
                        className="proposal"
                        placeholder="Add proposal name here..."
                        onChange={propsalTextHandler}
                      />
                      <Button
                        variant="success"
                        disabled={!isProposalFormTextValid}
                        onClick={submitProposal}
                      >
                        Submit
                      </Button>{" "}
                    </Stack>
                  </div>
                ) : (
                  ballotProposal
                )}
              </Card.Body>
            </Card>

            <br />

            <Card bg="light" className="text-center">
              <Card.Header>Add Candidates</Card.Header>
              <Card.Body>
                {!isCandidateFormSubmitted ? (
                  <Stack direction="horizontal" gap={3}>
                    <Form.Control
                      type="text"
                      placeholder="Add candidate's name here..."
                      onChange={candidateTextHandler}
                      value={candidateName}
                    />

                    <Form.Control
                      type="text"
                      placeholder="Add candidate's address here..."
                      onChange={candidateEthAddressHandler}
                      value={candidateEthAddress}
                    />

                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={
                        !isCandidateFormAddressValid ||
                        !isCandidateFormTextValid
                      }
                      onClick={addCandidate}
                    >
                      Add
                    </Button>
                    <Button
                      variant="success"
                      disabled={candidateNameArray.length <= 1}
                      onClick={submitCandidateName}
                    >
                      Submit
                    </Button>
                    <br />
                  </Stack>
                ) : (
                  <div></div>
                )}
                {candidateNameArray.map((element, index) => {
                  return (
                    <Card.Text key={index} value={index}>
                      {element}
                    </Card.Text>
                  );
                })}
              </Card.Body>
            </Card>

            <br />
            <div className="text-center">
              <Button
                onClick={deploySmartContract}
                variant="warning"
                disabled={!isCandidateFormSubmitted}
              >
                Deploy Smart Contract
              </Button>{" "}
            </div>
          </div>
        ) : (
          <div>
            <Card bg="light" className="text-center">
              <Card.Header>Official Ballot</Card.Header>
              <br />
              <div className="text-center">
                Contract Address: {contractAddress}
              </div>
              <div className="text-center">
                The winner of the ballot is: {winner}
                {/* {ballotWinner} . */}
              </div>
              <br />

              <div className="text-center">
                <Table
                  className="center"
                  striped
                  bordered
                  hover
                  style={{ width: 400 }}
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Canididate</th>
                      <th>Vote Tally</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((element, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{element[0]}</td>
                          <td>{element[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <div>
                <Form.Select
                  value={voteNumber}
                  onChange={(e) => handleChange(e)}
                >
                  {table.map((element, index) => {
                    return (
                      <option key={index} value={index}>
                        {element[0]}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>

              <br />

              <div>
                <Button variant="success" onClick={voteCandidate}>
                  Vote
                </Button>{" "}
              </div>

              <br />
            </Card>
          </div>
        )}

        {errorMessage}
      </Container>
      <br />
    </div>
  );
};

export default MetaMask_Wallet;
