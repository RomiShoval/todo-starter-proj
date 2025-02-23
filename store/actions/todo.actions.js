import { todoService } from "../../services/todo.service.js";
import { SET_TODOS,REMOVE_TODO,ADD_TODO,UPDATE_TODO,SET_FILTER_BY,SET_IS_LOADING } from "../reducers/todo.reducer.js";
import { store } from "../store.js";

export function removeTodo(todoId){
    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({type:REMOVE_TODO,todoId})
        })
        .catch(err => {
            console.log('err:', err)
            throw err
        })
} 

export function saveTodo(todo){
    const type = todo._id ? UPDATE_TODO :ADD_TODO
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({type:type,todo:savedTodo})
            return savedTodo
        })
        .catch(err => {
            console.log('err:', err)
            throw err
        })
} 



export function loadTodos(){
    store.dispatch({type:SET_IS_LOADING,isLoading:true})
    
    const filterBy = store.getState().toDoModule.filterBy
    return todoService.query(filterBy)
        .then(filteredTodos  => {
            store.dispatch({type:SET_TODOS,todos:filteredTodos })
            return filteredTodos
        })
        .catch(err => {
            console.eror('err:', err)
            throw err
        })
        .finally(() => {
            store.dispatch({type:SET_IS_LOADING,isLoading:false})
        })
}