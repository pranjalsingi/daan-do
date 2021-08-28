import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

import * as constants from "../constants";

import OpenCharity from "../abis/OpenCharity.json";
import { deposit } from "../utils";

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
        const depositReceipt = await deposit(constants.OPEN_CHARITY_ADDR, OpenCharity, this.state.amount);
        this.setState({'amount': ''});
    }

    render() {

        return (
            // <div className="row">
            //     <div className="col-4">
                    <Form>
                        <Form.Group className="mb-2">
                            {/* <Form.Label>Enter Ether Amount</Form.Label> */}
                            <h3>Enter Ether Amount</h3>
                            <Form.Control type="text" placeholder="Example: 3.456" value={this.state.amount} onChange={this.handleAmountChange}/>
                            <Form.Text className="text-muted">
                            We'll never share your ether with anyone else. We will just keep it.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" onClick={this.donateEther}>Donate</Button>
                    </Form>
            //     </div>
            // </div>
        );
    }
  }
  
  export default DonateEtherForm;
