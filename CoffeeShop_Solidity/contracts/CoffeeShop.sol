// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "hardhat/console.sol";

contract CoffeeShop {
  string public name;
  uint public coffeeCount = 0;
  mapping(uint => Coffee ) public coffees;

  struct Coffee {
    uint id;
    string hash;
    string description;
    uint priceAmount;
    address payable author;
  }

  event CoffeeCreated(
    uint id,
    string hash,
    string description,
    uint priceAmount,
    address payable author
  );

  event CoffeeTipped(
    uint id,
    string hash,
    string description,
    uint priceAmount,
    address payable author
  );

  


  function orderCoffee(string memory _coffeeHash, string memory _description) public {
    
    require(bytes(_coffeeHash).length > 0);
    
    require(bytes(_description).length > 0);
    
    require(msg.sender!=address(0));

   
    coffeeCount ++;
    

    coffees[coffeeCount] = Coffee(coffeeCount, _coffeeHash, _description, 0, payable(msg.sender));

    emit CoffeeCreated(coffeeCount, _coffeeHash, _description, 0, payable(msg.sender));
  }

  function payCoffeeOwner(uint _id) public payable {
      
    require(_id > 0 && _id <= coffeeCount);
  
    Coffee memory _coffee = coffees[_id];
   
    address payable _author = _coffee.author;
   
    payable(_author).transfer(msg.value);
    _coffee.priceAmount = _coffee.priceAmount + msg.value;
    
    coffees[_id] = _coffee;
    
    emit CoffeeTipped(_id, _coffee.hash, _coffee.description, _coffee.priceAmount, _author);
  }
}