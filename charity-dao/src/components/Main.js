import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';

import * as constants from "../constants";

import OpenCharity from "../abis/OpenCharity.json";
import { getCharities } from "../utils";

class App extends Component {
    componentWillMount() {
      this.loadBlockchainData()
    }
  
    async loadBlockchainData() {
      const charities = await getCharities(constants.OPEN_CHARITY_ADDR, OpenCharity);
      this.setState({ charities: charities })
    }
  
    constructor(props) {
      super(props)
      this.state = { charities: [] }
    }
  
    render() {
        let rows = [];
        for (let i in this.state.charities) {
            rows.push(<tr key={i}><td key={i}>{this.state.charities[i]}</td></tr>)
        }

        return (
        <div className="container">
            <table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Charity Addresses</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
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