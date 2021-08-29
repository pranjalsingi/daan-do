import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

import * as constants from "../constants";

import OpenCharity from "../abis/OpenCharity.json";
import { deposit, distribute } from "../utils";

class DonateEtherForm extends Component {

    constructor() {
        super()
        this.state = {
            amount: ''
        }
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.donateEther = this.donateEther.bind(this);
    }

    async handleAmountChange(e) {
        this.setState({'amount': e.target.value});
    }


    async donateEther(e) {
        if(Number(this.state.amount) === 0.0){
            alert('Amount should be great than 0');
            return;
        }
        const depositReceipt = await deposit(constants.OPEN_CHARITY_ADDR, OpenCharity, this.state.amount);
        this.setState({'amount': ''});
    }

    async distributeEther(e) {
        try{
            const distributeReceipt = await distribute(constants.OPEN_CHARITY_ADDR, OpenCharity);
        }
        catch(err){
            let index_of_single = err.data.message.search("'");
            alert(err.data.message.slice(index_of_single+1, err.data.message.length-1));
            console.log(err);
        }
    }

    render() {

        return (
            // <div className="row">
            //     <div className="col-4">
                    <Form>
                        <Form.Group className="mb-2">
                            {/* <Form.Label>Enter Ether Amount</Form.Label> */}
                            <h3>Enter Donation Amount</h3>
                            <Form.Control type="text" placeholder="Example: 3.456 ETH" value={this.state.amount} onChange={this.handleAmountChange}/>
                        </Form.Group>

                        <Button variant="primary" onClick={this.donateEther} className="me-2">Donate</Button>
                        <Button variant="primary" onClick={this.distributeEther}>Distribute Funds</Button>

                    </Form>
            //     </div>
            // </div>
        );
    }
  }
  
  export default DonateEtherForm;
