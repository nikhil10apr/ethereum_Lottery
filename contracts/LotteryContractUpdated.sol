pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Lottery {
    
    enum UserType {Issuer,Investor}
    enum LotteryState {NotStarted, Started,Finished}
    
    LotteryState public state;
    
    struct Player {
        address payable playerAddress;
        string playerName;
        string emailId;
        string phoneNumber;
        bool isExist;
    }
    
    struct LotteryTicket {
        uint lotteryId;
        uint price;
        address payable ticketOwner;
    }
    

    address private owner;
    uint32 private totalAmount;
    Player[] public winner;
    
    mapping (address => Player) playerMap;
    Player[] players;
    LotteryTicket[] tickets;

    constructor () public {
        state = LotteryState.NotStarted;
        owner = msg.sender;
    }

    function registerPlayer(string memory _name, string memory _emailId, string memory  _phoneNumber) public payable returns (string memory result) {
        //Owner shouldn't be player
        require(owner != msg.sender);
        require((state != LotteryState.NotStarted) && (state != LotteryState.Finished), "Player can't register while lottery has started or finished.");
        
        result = "FAIL !!!";
        if(!playerMap[msg.sender].isExist ) {
            Player memory _player = Player(msg.sender, _name, _emailId, _phoneNumber,true);
            playerMap[msg.sender] = _player;
            players.push(_player);
            result = "Registered Successfully !!!";
        }

        return(result);
        // new event to be send to owner
    }
    
    function startLottery() public{
        require (owner == msg.sender, "Only owner can open lottery process.");
        state = LotteryState.Started;
        
    }

    function stopLottery() public{
        require (owner == msg.sender, "Only owner can open lottery process.");
        state = LotteryState.Finished;
        
    }
    
    function buyLotteryTickets() public payable returns (string memory result) {
        require(msg.value > .01 ether);
        require(state == LotteryState.Started, "Lottery is not yet opened");
        require(owner != msg.sender, "Lottery owner/organizer can't buy tickets.");
        require(playerMap[msg.sender].isExist,"User not registered.");
        
        LotteryTicket memory ticket = LotteryTicket(tickets.length+1,1, msg.sender);
        totalAmount = totalAmount + 1;
        tickets.push(ticket);
        result = "Ticket Bought Successfully !!!";
        return(result);
        //event to be sendout to owner
    }
    
    function processLotteryWinners() public {
        require(msg.sender == owner, "Only owner can execute ");
        uint32 prizeMoney = totalAmount/2;
        /*uint32 firstPrizeMoney = prizeMoney * 50/100;
        uint32 secondPrizeMoney = prizeMoney * 30/100;
        uint32 thirdPrizeMondy = prizeMoney * 20/100;
        */
        //Randomly select the numbers
        
        uint randomNumber = uint(keccak256(abi.encodePacked(now,  tickets.length))) % tickets.length;
        LotteryTicket memory winnerTicket = tickets[randomNumber - 1];
        winnerTicket.ticketOwner.transfer(address(this).balance);
        winner.push(playerMap[winnerTicket.ticketOwner]);
        
        //Send notification
        
        state = LotteryState.NotStarted;
    }
    
    function getLotteryState() view public returns (LotteryState _state ) {
         //require(msg.sender == owner, "Only owner can execute ");
         _state = state;
    }

    function isPlayerRegistered() view public returns (bool _status ) {
        _status = playerMap[msg.sender].isExist;
    }

    function getLotteryTickets() view public returns (LotteryTicket[] memory _tickets ) {
         require(msg.sender == owner, "Only owner can execute ");
         return(tickets);
    }
    
    function getPlayers() view public returns (Player[] memory _players ) {
         require(msg.sender == owner, "Only owner can execute ");
         return(players);
    }
    
    function getWinner() view public returns (Player[] memory _players ) {
        _players = winner;
    }

    //TODO - Not working 
    function fetchMyTickets() view public returns (LotteryTicket[] memory _tickets ) {
        uint j = 0;
        for(uint i=0; i<tickets.length; i++) {
            if(tickets[i].ticketOwner == msg.sender) {
                _tickets[j] = tickets[i];
                j++;
            }
        }
    }
    
}
