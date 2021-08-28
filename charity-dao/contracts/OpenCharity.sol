// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract NGO {

    event NGORemittance(address _address, uint amount);
    address[] ngos = [
        0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,
        0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c,
        0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
    ]; //list of charity addresses (hardcoded)
    
    function getNGOs() external view returns (address[] memory) {
        return ngos;
    }
    
    function depositToNGO(address _address, uint eachCut) internal {
        payable(_address).transfer(eachCut);
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
        
        // increase the total amount of the address
        totalAmountPerAddress[msg.sender] += msg.value;
        
        // store the ordered transaction per interval
        
        intervalDepo.addresses.push(msg.sender);
        intervalDepo.amounts.push(msg.value);

        emit newDonor(msg.sender, msg.value);
    }
    
    function getDonorAddresses() external view returns (address[] memory){
        return intervals[intervals.length - 1].addresses;
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
        require(block.timestamp - intervalDist.startTime >= 10 seconds, "Minimum 5 minutes interval required");
        uint eachCut = address(this).balance/ngos.length;
        // payable(ngos[0]).transfer(address(this).balance);
        for(uint i = 0; i < ngos.length; i++){
            if (i > (ngos.length - 2)){
                depositToNGO(ngos[i], address(this).balance);
            }
            else{
                depositToNGO(ngos[i], eachCut);
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