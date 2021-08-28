import { ethers } from 'ethers';
import { requestAccount, getContract } from "./common";

async function getCharities(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        console.log('this is called. Hurray!')
        try {
            let ngos = await charitycontract.getNGOs();
            return ngos;
        }
        catch (err) {
            console.log(err);
        }
    }
}


export { getCharities }