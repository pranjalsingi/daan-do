// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract NGO {

    event NGORemittance(address _address, uint amount);
    address[] ngos = [
        0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
        0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
        0x976EA74026E726554dB657fA54763abd0C3a0aa9
    ]; //list of charity addresses (hardcoded)

    uint[] amountReceivedByNGOs = [0, 0, 0];

    function getAmountReceivedByNGOs() external view returns (uint[] memory) {
        return amountReceivedByNGOs;
    }
    
    function getNGOs() external view returns (address[] memory) {
        return ngos;
    }
    
    function depositToNGO(address _address, uint eachCut, uint _index) internal {
        payable(_address).transfer(eachCut);
        amountReceivedByNGOs[_index] += eachCut;
        emit NGORemittance(_address, eachCut);
    }

}

contract OpenCharity is NGO {

    event newDonor(address _address, uint amount);
    
    struct Interval {
        uint total_amount;

        address[] addresses;
        uint[] amounts;
        
        uint startTime;
        uint endTime;
    }
    
    Interval[] intervals;
    mapping(address => uint) totalAmountPerAddress;

    address[] addressesDonated;
    
    
    constructor() {
        Interval memory interval;
        interval.total_amount = 0;
        interval.startTime = block.timestamp;
        intervals.push(interval);
    }
    
    function deposit() payable external {
        Interval storage intervalDepo = intervals[intervals.length - 1];
        // increase the total amount of interval
        intervalDepo.total_amount += msg.value;

        if(totalAmountPerAddress[msg.sender] == 0) {
            addressesDonated.push(msg.sender);
        }
        
        // increase the total amount of the address
        totalAmountPerAddress[msg.sender] += msg.value;
        
        // store the ordered transaction per interval
        
        intervalDepo.addresses.push(msg.sender);
        intervalDepo.amounts.push(msg.value);

        emit newDonor(msg.sender, msg.value);
    }
    
    function getDonorAddressesPerInterval() external view returns (address[] memory){
        return intervals[intervals.length - 1].addresses;
    }

    function getAmountPerAddress(address _address) external view returns (uint) {
        return totalAmountPerAddress[_address];
    }

    function getDonorAddresses() external view returns (address[] memory){
        return addressesDonated;
    }
    
    function getDonorAmounts() external view returns (uint[] memory){
        return intervals[intervals.length - 1].amounts;
    }
    
    function allIntervals() external view returns (Interval[] memory){
        return intervals;
    }
    
    function currentBalance() external view returns(uint){
        return address(this).balance;
    }
    
    function getIntervalStart() external view returns(uint){
        return intervals[intervals.length - 1].startTime;
    }
    
    function distribute() external{
        Interval storage intervalDist = intervals[intervals.length - 1];
        // return intervalDist.startTime;//
        
        // require a minimum interval time of 5 minutes
        require(block.timestamp - intervalDist.startTime >= 1 minutes, "Minimum 1 minute interval required");
        uint eachCut = address(this).balance/ngos.length;
        // payable(ngos[0]).transfer(address(this).balance);
        for(uint i = 0; i < ngos.length; i++){
            if (i > (ngos.length - 2)){
                depositToNGO(ngos[i], address(this).balance, i);
            }
            else{
                depositToNGO(ngos[i], eachCut, i);
            }  
        }
        intervalDist.endTime = block.timestamp;
        Interval memory newInterval;
        newInterval.total_amount = 0;
        newInterval.startTime = block.timestamp;
        intervals.push(newInterval);
    }
    
}



// Done - Accept payment from an address to the OpenCharity contract 

// Done - Smart contract should increase the total balance by the amount received for that interval
// Done - An event should be fired when someone makes a payment(Front can listen to this event and update the UI accordingly)

// Done - Distribute accumulated funds every x interval(right now just pay all of them qually)

// Done - During an interval, which accounts paid and how much
// Done - Store how many funds were distributed per interval

// Done - We should accumulate all the funds ever paid by an account


// Done:
// Hard code all the addresses of charity accounts