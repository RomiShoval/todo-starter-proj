import { toDoReducer } from "./reducers/todo.reducer.js";
import {userReducer} from './reducers/userReducer.js'

const { createStore, combineReducers, compose } = Redux

const rootReducer = combineReducers({
    toDoModule: toDoReducer,
    userModule: userReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())