const initialState = {
    panelType: 'register'
}

export const SET_PLAYER_PANEL = 'SET_PLAYER_PANEL';

export const setPanelType = (panelType) => ({
    type: SET_PLAYER_PANEL,
    panelType
})

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLAYER_PANEL:
            return {
            	...state,
            	panelType: action.panelType
            };
        default:
            return state;
    }
}