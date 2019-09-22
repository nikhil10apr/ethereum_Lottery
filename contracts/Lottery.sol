pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

//import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Lottery {
    //using SafeMath for uint;
    
    enum UserType {Issuer,Investor}
    enum LotteryState {NotStarted, Started,Finished, Terminated}
    
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
        address ticketOwner;
    }
    

    address private owner;
    LotteryState private state;
    uint private ticketPrice;
    Player private winner;
    
    Player[] players;
    LotteryTicket[] tickets;
    
    mapping (address => Player) playerMap;
    mapping(address => LotteryTicket[]) playerLotteryTicketsMapping;
    
    //events
    event NewUser(address user);
    event BuyTicket(address buyer, uint ticketsCount, uint totalAnount);
    
    event LotteryWinner(address winner, uint amount);
    event LotteryStatusUpdate(address player, string status);
    event LotteryStatusUpdateWithMessage(address player, string status, string message);
    
    // This will be used if lottery owner does premature termination of lottery and in this case amount should be refunded to each player
    event RefundLottery(address player, uint amount); 
    
    constructor () public {
        state = LotteryState.NotStarted;
        owner = msg.sender;
    }
    
    function registerPlayer(string memory _name, string memory _emailId, string memory  _phoneNumber) public {
        //Owner shouldn't be player
        require(owner != msg.sender, "Lottery owner can't register as player.");
        require(state == LotteryState.Started, "Player can't register while lottery has started or finished.");
        require(!playerMap[msg.sender].isExist, "User already registered as player");
        
        Player memory _player = Player(msg.sender, _name, _emailId, _phoneNumber,true);
        playerMap[msg.sender] = _player;
        players.push(_player);
        
        // new event to be send to owner
        emit NewUser(msg.sender);

    }
    
    function startLottery(uint _ticketPrice) public{
        require (owner == msg.sender, "Only owner can open lottery process.");
        ticketPrice = _ticketPrice;
        state = LotteryState.Started;
    }
    
    function terminateLottery() public {
        require (owner == msg.sender, "Only owner can close lottery.");
        require (state == LotteryState.Started, "To cancel lottery contract, it should be in Started state");
        state = LotteryState.Terminated;
        emit LotteryStatusUpdateWithMessage(msg.sender, getLotteryState(), "Lottery has been terminated, you will receive refund shortly.");
        
        //Refund process for every player
        for (uint counter = 0; counter < players.length; counter++) {
            Player memory player = players[counter];
            LotteryTicket[] memory tickets = playerLotteryTicketsMapping[player.playerAddress];
            uint playerAmount = tickets.length * ticketPrice;
            if(playerAmount > 0) {
                player.playerAddress.transfer(playerAmount);
                emit RefundLottery(player.playerAddress, playerAmount);
            }
        }
        
    }
    
    
    function buyLotteryTickets(uint count, uint value) public payable {
        require(owner != msg.sender, "Lottery owner/organizer can't buy tickets.");
        require(state == LotteryState.Started, "Lottery is not yet opened");
        require(playerMap[msg.sender].isExist,"User not registered.");
        require(msg.sender.balance > value, "Insufficient balance to purchase ticket(s).");
        //uint memory ticketsPrice = count.mul(ticketPrice);
        uint  ticketsPrice = count * ticketPrice;
        require(value == ticketsPrice, "There is difference between actual price and provided price.");
        require(msg.value == ticketsPrice, "Amount sent for buying ticket(s) are not sufficient");
        
        for(uint counter=1; counter <= count; counter++) {
            //LotteryTicket memory ticket = LotteryTicket(tickets.length.add(count),ticketPrice, msg.sender);
            LotteryTicket memory ticket = LotteryTicket(tickets.length + count,ticketPrice, msg.sender);
            tickets.push(ticket);
            playerLotteryTicketsMapping[msg.sender].push(ticket);
        }
        
        //event event
        emit BuyTicket(msg.sender, count, value);
    }
    
    function processLotteryWinners() public returns (Player memory _winner) {
        require(msg.sender == owner, "Only owner can execute ");
        require(state == LotteryState.Started, "Lottery is not yet opened");
        
        /*uint32 firstPrizeMoney = prizeMoney * 50/100;
        uint32 secondPrizeMoney = prizeMoney * 30/100;
        uint32 thirdPrizeMondy = prizeMoney * 20/100;
        */
        //Randomly select the numbers
        
        uint randomNumber = uint(keccak256(abi.encodePacked(now,  tickets.length))) % tickets.length;
        LotteryTicket memory winnerTicket = tickets[randomNumber - 1];
        
        winner = playerMap[winnerTicket.ticketOwner];
        winner.playerAddress.transfer(getPrizeAmount());
        
        state = LotteryState.Finished;
        //Send notification
        emit LotteryWinner(winner.playerAddress, getPrizeAmount());
        return winner;
        
    }
    
    function getPrizeAmount() view public returns(uint _amount) {
        return (address(this).balance/2);
    }
    
    function getWinner() view public returns (Player memory _winner) {
        _winner = winner;
        return _winner;
    }
    
    function getLotteryState() view public returns (string memory _state) {
        if (LotteryState.NotStarted == state) 
            _state = "NotStarted";
        else if (LotteryState.Started == state) 
            _state = "Started";
        else if (LotteryState.Finished == state)
            _state = "Finished";
        else if (LotteryState.Terminated == state)
            _state = "Terminated";
            
       return _state;
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
    
    function getMyLotteryTickets() view public returns (LotteryTicket[] memory _tickets) {
        require(msg.sender != owner, "Owner can't have tickets ");
       _tickets = playerLotteryTicketsMapping[msg.sender];
    }
    
}
