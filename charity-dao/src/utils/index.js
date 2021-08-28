import { ethers } from 'ethers';
import { requestAccount, getContract } from "./common";

import * as constants from "../constants";

async function getCharities(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        console.log('this is called. Hurray!')
        try {
            let ngos = await charitycontract.getNGOs();
            let amountPerNGOs = await charitycontract.getAmountReceivedByNGOs();
            let ngosDonatedAmounts = [];
            for(let i in ngos){
                let address = ngos[i];
                let amount = amountPerNGOs[i];
                ngosDonatedAmounts.push([address, ethers.utils.formatUnits(amount, constants.ETHER_TO_WEI)]);
            }
            return ngosDonatedAmounts;
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function getContractBalance(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let balance = await charitycontract.currentBalance();
            balance = ethers.utils.formatUnits(balance, constants.ETHER_TO_WEI)
            console.log(balance.toString());
            return balance.toString();
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function getIntervalStart(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let startInterval = await charitycontract.getIntervalStart();
            console.log('Start interval: ' + startInterval);
            return startInterval.toString();
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function getLeaderboard(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let donorAddresses = await charitycontract.getDonorAddresses();
            console.log('donor addresses: ' + donorAddresses);
            let donorAddressesAmounts = []
            for(let i in donorAddresses){
                let address = donorAddresses[i];
                let amount = await charitycontract.getAmountPerAddress(address);
                donorAddressesAmounts.push([address, ethers.utils.formatUnits(amount, constants.ETHER_TO_WEI)]);
            }
            donorAddressesAmounts.sort(function(a, b){return b[1] - a[1]});
            console.log('Sorted leaderboard: ' + donorAddressesAmounts);
            return donorAddressesAmounts;
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function deposit(contractAddr, artifact, etherDonate) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let amount = ethers.utils.parseEther(etherDonate);
            console.log('GWEI: ' + amount);
            let transaction = await charitycontract.deposit({value: amount});

            let receipt = await transaction.wait();
            console.log(receipt);
            return receipt;
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function distribute(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let transaction = await charitycontract.distribute();

            let receipt = await transaction.wait();
            console.log('Distribute receipt: ' + receipt);
            return receipt;
        }
        catch (err) {
            console.log(err);
        }
    }
}


export { getCharities, getContractBalance, getIntervalStart, getLeaderboard, deposit, distribute }