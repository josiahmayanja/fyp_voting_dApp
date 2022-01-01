import Button from 'react-bootstrap/Button'
import React, { Component } from 'react'

function sayHello() {
    alert('You clicked me!');
  }

const Vote = () => {
    return (
    <div>
      <Button onClick={sayHello} variant="secondary">Vote</Button>{' '}
    </div>
    );
}

export default Vote;