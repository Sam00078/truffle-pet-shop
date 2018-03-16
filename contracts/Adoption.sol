pragma solidity ^0.4.19;

contract Adoption {
  address[16] public adopters;

  function adopt(uint petId) public returns (uint) {
    require (0 <= petId && petId <= 15);
    adopters[petId] = msg.sender;
    return petId;
  }

  function getAdopters() public view returns (address[16]) {
    return adopters;
  }
}
