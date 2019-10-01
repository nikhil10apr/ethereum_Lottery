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
    uint32 private ticketPrice;
    Player[] public winner;
    
    mapping (address => Player) playerMap;
    mapping(address => LotteryTicket[]) playerLotteryTicketsMapping;

    Player[] players;
    LotteryTicket[] tickets;

    constructor () public {
        state = LotteryState.NotStarted;
        owner = msg.sender;
    }

    //----------- EVENTS-----------
    event playerRegistered(
        address _address
    );

    event lotteryStatusUpdate(
        LotteryState _status
    );

    event ticketSold(
        address _address
    );

    event winnerIs(
        Player _player,
        LotteryTicket _ticket,
        LotteryState _status,
        uint256 _balance
    );
    //----------- EVENTS-----------

    function registerPlayer(string memory _name, string memory _emailId, string memory  _phoneNumber) public payable returns (string memory result) {
        //Owner shouldn't be player
        require(owner != msg.sender);
        require((state != LotteryState.NotStarted) && (state != LotteryState.Finished), "Player can't register while lottery has started or finished.");
        
        if(!playerMap[msg.sender].isExist ) {
            Player memory _player = Player(msg.sender, _name, _emailId, _phoneNumber, true);
            playerMap[msg.sender] = _player;
            players.push(_player);
            // Event to Manager
            emit playerRegistered(msg.sender);
        }
    }
    
    function startLottery(uint32 _ticketPrice) public{
        require (owner == msg.sender, "Only owner can open lottery process.");
        state = LotteryState.Started;
        ticketPrice = _ticketPrice;
        // Event to All Players
        emit lotteryStatusUpdate(state);
    }

    function stopLottery() public{
        require (owner == msg.sender, "Only owner can open lottery process.");
        state = LotteryState.Finished;
        // Event to All Players
        emit lotteryStatusUpdate(state);
    }
    
    function buyLotteryTickets(uint32 _ticketNumbers) public payable returns (string memory result) {
        require(msg.value >= (_ticketNumbers*ticketPrice), "Insufficient balance.");
        require(state == LotteryState.Started, "Lottery is not yet opened");
        require(owner != msg.sender, "Lottery owner/organizer can't buy tickets.");
        require(playerMap[msg.sender].isExist,"User not registered.");
        
        for(uint i=0; i<_ticketNumbers; i++) {
           LotteryTicket memory ticket = LotteryTicket(tickets.length+1,ticketPrice, msg.sender);
            totalAmount = totalAmount + ticketPrice;
            tickets.push(ticket);
            playerLotteryTicketsMapping[msg.sender].push(ticket);
        }
        // Event to Manager
        emit ticketSold(msg.sender);
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
        winnerTicket.ticketOwner.transfer(address(this).balance/2);
        winner.push(playerMap[winnerTicket.ticketOwner]);
        
        //Send notification
        
        state = LotteryState.NotStarted;

        // Event to Everyone
        emit winnerIs(playerMap[winnerTicket.ticketOwner], winnerTicket, state, address(this).balance);
    }
    
    function getLotteryState() view public returns (LotteryState _state ) {
         //require(msg.sender == owner, "Only owner can execute ");
         _state = state;
    }

    function getTicketPrice() view public returns (uint32 _price ) {
         //require(msg.sender == owner, "Only owner can execute ");
         _price = ticketPrice;
    }

    function getPrizeAmount() view public returns(uint _amount) {
        return (address(this).balance/2);
    }

    function getTotalAmount() view public returns (uint256 _price ) {
         //require(msg.sender == owner, "Only owner can execute ");
         _price = address(this).balance;
    }

    function isPlayerRegistered() view public returns (bool _status ) {
        _status = playerMap[msg.sender].isExist;
    }

    function getLotteryTickets() view public returns (LotteryTicket[] memory _tickets ) {
         require(msg.sender == owner, "Only owner can execute ");
         _tickets = tickets;
    }
    
    function getPlayers() view public returns (Player[] memory _players ) {
         require(msg.sender == owner, "Only owner can execute ");
         _players = players;
    }
    
    function getWinner() view public returns (Player[] memory _players ) {
        _players = winner;
    }

    function fetchMyTickets() view public returns (LotteryTicket[] memory _mytickets ) {
        require(msg.sender != owner, "Owner can't have tickets ");
       _mytickets = playerLotteryTicketsMapping[msg.sender];
    }

    function getPlayerData() view public returns (Player memory _player ) {
       _player = playerMap[msg.sender];
    }
}
