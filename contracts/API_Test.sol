// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.18;

contract DummyContract {

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);

    function transfer(address _to, uint256 _tokenId) public {
        emit Transfer(msg.sender, _to, _tokenId);
    }
    
}