const initialState = {
    panelType: 'manageLottery'
}

export const SET_ADMIN_PANEL = 'SET_ADMIN_PANEL';

export const setPanelType = (panelType) => ({
    type: SET_ADMIN_PANEL,
    panelType
})

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADMIN_PANEL:
            return Object.assign({}, state, { panelType: action.panelType });
        default:
            return state;
    }
}