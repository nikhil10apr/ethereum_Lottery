import { combineReducers } from 'redux'

import { reducer as player } from './player'
import { reducer as admin } from './admin'

const initialState = {};
function todoApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}

const rootReducer = combineReducers({
  player,
  admin
})

export default rootReducer