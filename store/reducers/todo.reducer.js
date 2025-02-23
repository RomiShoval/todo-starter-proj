import {todoService} from "../../services/todo.service.js"

export const SET_TODOS = 'SET_TODOS'
export const SET_TODO = 'SET_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const UPDATE_TODO_FIELD = 'UPDATE_TODO_FIELD'
// export const UNDO_CARS = 'UNDO_CARS'


const initialState = {
    todos: [],
    lastTodos: [],
    filterBy: todoService.getDefaultFilter(),
    isLoading: false,
//     shoppingCart: [],
//     isCartShown: false,
}

export function toDoReducer(state = initialState , cmd={}){
    switch(cmd.type){
        case SET_TODOS:
            return{
                ...state,
                todos:cmd.todos
            }
            case REMOVE_TODO:
            return {
                ...state,
                todos : state.todos.filter(todo => todo._id!=cmd.todoId),
                lastTodos:[...state.todos]
                
            }
            case ADD_TODO:
            return {
                ...state,
                todos : [...state.todos,cmd.todo],
            }
            case UPDATE_TODO:
            return {
                ...state,
                todos : state.todos.map(todo => todo._id ===cmd.todo._id ? cmd.todo : todo )
            }
            case  SET_FILTER_BY:
            return {
                ...state,
                filterBy : {...state.filterBy,...cmd.filterBy}
            }
            case  SET_IS_LOADING:
            return {
                ...state,
                isLoading : cmd.isLoading
            }
            case  SET_TODO:
            return {
                ...state,
                todo : cmd.todo
            }
            case  UPDATE_TODO_FIELD:
            return {
                ...state,
                todos : state.todos.map(todo => 
                    todo._id === cmd.todoId ? {...todo,[cmd.field] : cmd.value} : todo
                )
            }
            default:
                return state
    }   
            
}   
