import React, { Component } from 'react';
import { Button, Container, Navbar, Table } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

import * as constants from "../constants";
import DonateEtherForm from "./Forms";
// import Countdown from 'react-countdown';
import OpenCharity from "../abis/OpenCharity.json";
import { getCharities, getContractBalance, getIntervalStart, getLeaderboard, totalReceived, lastIntervalCollection, getAllIntervals } from "../utils";

class App extends Component {
    componentWillMount() {
      this.loadBlockchainData()
    }
  
    async loadBlockchainData() {
      const charities = await getCharities(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const contractCurrentBalance = await getContractBalance(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const startInterval = await getIntervalStart(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const leaderboard = await getLeaderboard(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const totalMoneyReceived = await totalReceived(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const lastIntervalReceived = await lastIntervalCollection(constants.OPEN_CHARITY_ADDR, OpenCharity);
      const transactions = await getAllIntervals(constants.OPEN_CHARITY_ADDR, OpenCharity);
    //   const depositReceipt = await deposit(constants.OPEN_CHARITY_ADDR, OpenCharity, '100.34534');
    //   const distributeReceipt = await distribute(constants.OPEN_CHARITY_ADDR, OpenCharity);
      this.setState({
          charities: charities,
          contractCurrentBalance: contractCurrentBalance,
          leaderboard: leaderboard,
          totalMoneyReceived: totalMoneyReceived,
          lastIntervalReceived: lastIntervalReceived,
          startInterval: startInterval,
          transactions: transactions,
     })
    }

    constructor(props) {
      super(props)
      this.state = {
          charities: [],
          contractCurrentBalance: null,
          leaderboard: null,
          totalMoneyReceived: 0,
          lastIntervalReceived: 0,
          startInterval: 0,
          transactions: []
        }
    }

    render() {

        
        // let intervalStart = this.state.startInterval;
        // var remainingTime = window.setInterval(function(){
        //     let now = new Date();
        //     if((intervalStart - now.getTime()/1000) > 0){
        //         return intervalStart - now.getTime();
        //     }
        //     else{
        //         return 0;
        //     }
        // }, 1000);


        let rows = [];
        for (let i in this.state.charities) {
                rows.push(
                    <tr key={this.state.charities[i][0]}>
                        <td>{this.state.charities[i][0]}</td>
                        <td>{this.state.charities[i][1] + " ETH"}</td>
                    </tr>
                );
        }
        let rowNumbers = 0;
        let leaderRows = [];
        for (let i in this.state.leaderboard) {
            if(rowNumbers < 5){
                leaderRows.push(
                    <tr key={this.state.leaderboard[i][0]}>
                        <td>{this.state.leaderboard[i][0]}</td>
                        <td>{this.state.leaderboard[i][1] + " ETH"}</td>
                    </tr>
                );
            }
            rowNumbers++;
        }

        rowNumbers = 0;
        let intervalRows = [];
        for (var i = this.state.transactions.length - 1; i >= 0; i--) {
            if(rowNumbers < 5){
                intervalRows.push(
                    <tr key={this.state.transactions[i][0]}>
                        <td>{this.state.transactions[i][0]}</td>
                        <td>{this.state.transactions[i][1] + " ETH"}</td>
                    </tr>
                );
            }
            rowNumbers++;
        }

        let money = this.state.totalMoneyReceived;

        return (
        <div>    
            <Navbar bg="dark" variant="dark">
                {/* <Container> */}
                <Navbar.Brand href="#home" className="mx-auto">
                Charity DAO
                </Navbar.Brand>
                {/* </Container> */}
            </Navbar>

            <div className="container">
                {/* <Countdown date={this.state.startInterval * 1000} /> */}
                <div className="row mt-5">
                    <div className="col-6">
                    <DonateEtherForm />
                    </div>
                    <div className="col-6">
                        <h3>Statistics</h3>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Total Amount Received</td>
                                    <td>{money} ETH</td>
                                </tr>
                                <tr>
                                    <td>Current Interval Balance</td>
                                    <td>{this.state.contractCurrentBalance} ETH</td>
                                </tr>
                                <tr>
                                    <td>Last Distributed Interval Balance</td>
                                    <td>{this.state.lastIntervalReceived} ETH</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
                <div className="row mt-4">
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
                        <Table className="table">
                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Amount Donated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderRows}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-6">
                        <h3>Latest Donations</h3>
                        <Table className="table">
                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Amount Donated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {intervalRows}
                            </tbody>
                        </Table>
                    </div>
                </div>
                
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