import Select from 'react-select'
import React, { Component } from 'react'


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]



const Select = () => {
    return (
    <div>
    <Select options={options} />
    </div>
    );
}

  export default Select;
  
  