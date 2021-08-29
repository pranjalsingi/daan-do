import { BigNumber, ethers } from 'ethers';
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
                ngosDonatedAmounts.push([address, Number(ethers.utils.formatUnits(amount, constants.ETHER_TO_WEI)).toFixed(4)]);
            }
            // console.log('ngos donated - '+ngosDonatedAmounts)
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
            let targetTime = Number(startInterval) + 6000;
            // let now = new Date();
            // var remainingTime = window.setInterval(function(){
            //     if(targetTime - now.getTime() > 0){
            //         return targetTime - now.getTime();
            //     }
            //     else{
            //         return 0;
            //     }
            //   }, 1000);
            console.log('Start interval: ' + startInterval + 'yo' + targetTime);
            return targetTime;
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function getAllIntervals(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let intervals = await charitycontract.allIntervals();
            console.log('intervals- '+intervals);
            let len = intervals.length;
            let currentInterval = intervals[len - 1];
            let transactionsAddresses = currentInterval.addresses;
            let transcactionsAmounts = currentInterval.amounts;
            let transactions = [];
            if(len > 1){
                let previousInterval = intervals[len - 2];
                let previousAddresses = previousInterval.addresses;
                let previousAmounts = previousInterval.amounts;
                for(let i in previousAddresses){
                    transactions.push([previousAddresses[i], ethers.utils.formatUnits(previousAmounts[i], constants.ETHER_TO_WEI)]);
                }
            }
            for(let i in transactionsAddresses){
                transactions.push([transactionsAddresses[i], ethers.utils.formatUnits(transcactionsAmounts[i], constants.ETHER_TO_WEI)]);
            }
            console.log('transactions - ' + transactions)
            // console.log('Start interval: ' + targetTime + 'yo' + remainingTime);
            return transactions;
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

async function totalReceived(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let donorAddresses = await charitycontract.getDonorAddresses();
            console.log('donor addresses: ' + donorAddresses);
            let totalAmountReceived = 0;
            for(let i in donorAddresses){
                let address = donorAddresses[i];
                let amount = await charitycontract.getAmountPerAddress(address);
                totalAmountReceived += Number(amount);
            }
            // donorAddressesAmounts.sort(function(a, b){return b[1] - a[1]});
            // console.log('Sorted leaderboard: ' + donorAddressesAmounts);
            // console.log('yo' + totalAmountReceived);
            return ethers.utils.formatUnits(totalAmountReceived.toString(), constants.ETHER_TO_WEI);
        }
        catch (err) {
            console.log(err);
        }
    }
}

async function lastIntervalCollection(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
        await requestAccount();
        const charitycontract = getContract(contractAddr, artifact);
        try {
            let totalIntervals = await charitycontract.getTotalIntervals();
            let lastCollection = 0;
            if(totalIntervals > 1){
                lastCollection = await charitycontract.getAmountCollectedInInterval(totalIntervals - 2);
            }
            return ethers.utils.formatUnits(lastCollection, constants.ETHER_TO_WEI);
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
        let transaction = await charitycontract.distribute();

        let receipt = await transaction.wait();
        console.log('Distribute receipt: ' + receipt);
        return receipt;
        
    }
}


export { getCharities, getContractBalance, getIntervalStart, getLeaderboard, deposit, distribute, totalReceived, lastIntervalCollection, getAllIntervals }