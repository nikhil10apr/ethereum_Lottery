import { combineReducers } from 'redux'

const initialState = {};
function todoApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}

const rootReducer = combineReducers({
  todoApp
})

export default rootReducer