import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

import * as constants from "../constants";
import DonateEtherForm from "./Forms";

import OpenCharity from "../abis/OpenCharity.json";
import { getCharities, getContractBalance, getIntervalStart, getLeaderboard, deposit, distribute } from "../utils";

class App extends Component {
    componentWillMount() {
      this.loadBlockchainData()
    }
  
    async loadBlockchainData() {
      const charities = await getCharities(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const contractCurrentBalance = await getContractBalance(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const intervalStart = await getIntervalStart(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const leaderboard = await getLeaderboard(constants.OPEN_CHARITY_ADDR, OpenCharity);
    //   const depositReceipt = await deposit(constants.OPEN_CHARITY_ADDR, OpenCharity, '100.34534');
    //   const distributeReceipt = await distribute(constants.OPEN_CHARITY_ADDR, OpenCharity);
      this.setState({
          charities: charities,
          contractCurrentBalance: contractCurrentBalance,
          leaderboard: leaderboard
     })
    }

    async distributeEther(e) {
        const distributeReceipt = await distribute(constants.OPEN_CHARITY_ADDR, OpenCharity);
    }

    constructor(props) {
      super(props)
      this.state = {
          charities: [],
          contractCurrentBalance: null,
          leaderboard: null
        }
    }

    render() {
        let rows = [];
        for (let i in this.state.charities) {
            rows.push(
                <tr key={this.state.charities[i][0]}>
                    <td>{this.state.charities[i][0]}</td>
                    <td>{this.state.charities[i][1]}</td>
                </tr>
            )
        }

        let leaderRows = [];
        for (let i in this.state.leaderboard) {
            leaderRows.push(
                <tr key={this.state.leaderboard[i][0]}>
                    <td>{this.state.leaderboard[i][0]}</td>
                    <td>{this.state.leaderboard[i][1]}</td>
                </tr>
            )
        }

        return (
        <div className="container">
            <div className="row">
            <div className="col-6">
                    <h3>Charities</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Amount Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <div className="col-6">
                    <h3>LeaderBoard</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Amount Donated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderRows}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-6">
                <DonateEtherForm />
                </div>
                <div className="col-6">
                    <h3>Smart Contract Balance: {this.state.contractCurrentBalance}</h3>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-6">
                    <h3>Distribute Funds</h3>
                    <Button variant="primary" onClick={this.distributeEther}>Distribute Funds</Button>
                </div>
                {/* <div className="col-6">
                    <h3>Smart Contract Balance: {this.state.contractCurrentBalance}</h3>
                </div> */}
            </div>
        </div>
        );
    }
  }
  
  export default App;


// function DisplayAddress() {
//     const [walletAddr, setWalletAddr] = useState();
//     const [etherReq, setEtherReq] = useState();
//     const [etherDonate, setEtherDonate] = useState();
//     const [requestLoading, setRequestLoading] = useState(false);
//     const [donateLoading, setDonateLoading] = useState(false);

//     async function handleGetEther() {
//         setRequestLoading(true);
//         await getEther(constants.OPEN_CHARITY_ADDR, OpenCharity, etherReq, walletAddr);
//         setRequestLoading(false);
//     }

//     async function handleDonateEther() {
//         setDonateLoading(true);
//         await donateEther(constants.OPEN_CHARITY_ADDR, OpenCharity, etherDonate);
//         setDonateLoading(false);
//     }

//     async function handleGetCharities() {
//         return await getCharities(constants.OPEN_CHARITY_ADDR, OpenCharity);
//     }

//     return (
//         // <div className="App" style={{ padding: "50px" }}>
//         //     <Typography variant="h4">
//         //         Rinkeby Faucet
//         //     </Typography>

//         //     <TextField fullWidth onChange={e => setWalletAddr(e.target.value)} label="Wallet Address" /><br /><br />
//         //     <TextField fullWidth onChange={e => setEtherReq(e.target.value)} type="number" label="Ethers Required" /><br /><br />

//         //     {requestLoading && <div><p>Loading...</p><br /></div>}
//         //     <Button onClick={handleGetEther} variant="contained" color="primary">
//         //         Submit
//         //     </Button><br /><br /><br />

//         //     <Divider light /><br /><br />

//         //     <TextField fullWidth onChange={e => setEtherDonate(e.target.value)} type="number" label="Ethers to donate" /><br /><br />
//         //     {donateLoading && <div><p>Loading...</p><br /></div>}
//         //     <Button onClick={handleDonateEther} variant="contained" color="primary">
//         //         Submit
//         //     </Button><br /><br />
//         // </div>
//         <div>The charities addresses are: {handleGetCharities()}</div>
//     );
// }

// export default DisplayAddress;