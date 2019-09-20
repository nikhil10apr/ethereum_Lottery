const initialState = {
    panelType: 'manageLottery',
    ticketPrice: 0,
    winner: {}
}

export const SET_ADMIN_PANEL = 'SET_ADMIN_PANEL';
export const SET_TICKET_PRICE = 'SET_TICKET_PRICE';
export const SET_LOTTERY_WINNER = 'SET_LOTTERY_WINNER';

export const setPanelType = (panelType) => ({
    type: SET_ADMIN_PANEL,
    panelType
})

export const setTicketPrice = (ticketPrice) => ({
    type: SET_TICKET_PRICE,
    ticketPrice
})

export const setLotteryWinner = (winner) => ({
    type: SET_LOTTERY_WINNER,
    winner
})

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADMIN_PANEL:
            return Object.assign({}, state, { panelType: action.panelType });
        case SET_TICKET_PRICE:
            return Object.assign({}, state, { ticketPrice: action.ticketPrice });
        case SET_LOTTERY_WINNER:
            return Object.assign({}, state, { winner: action.winner });
        default:
            return state;
    }
}