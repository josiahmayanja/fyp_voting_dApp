import Button from 'react-bootstrap/Button'
import React, { Component } from 'react'
import { ethers } from 'ethers';

function sayHello() {
    alert('You voted');
  }


const Vote = () => {
    return (
    <div>
      <Button onClick={sayHello} variant="secondary">Vote</Button>{' '}
    </div>
    );
}



export default Vote;