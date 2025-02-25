import { todoService } from "../../services/todo.service.js";
import { userService } from "../../services/user.service.js";
import { SET_TODOS,REMOVE_TODO,ADD_TODO,UPDATE_TODO,SET_FILTER_BY,SET_IS_LOADING } from "../reducers/todo.reducer.js";
import { SET_USER } from "../reducers/userReducer.js";
import { store } from "../store.js";
import { STORAGE_KEY_LOGGEDIN } from "../../services/user.service.js";

export function removeTodo(todoId){
    return todoService.get(todoId)
    .then(todo => {
        return todoService.remove(todoId)
            .then(() => {
                store.dispatch({ type: REMOVE_TODO, todoId })

                const user = store.getState().userModule.loggedInUser;
                if (user) {
                    const updatedUser = {
                        ...user,
                        activities: [...user.activities, { txt: `Removed Todo: '${todo.txt}'`, at: Date.now() }]
                    };
                    store.dispatch({ type: SET_USER, user: updatedUser })
                    userService.updateUser(updatedUser)
                }
            });
    })
    .catch(err => {
        console.error('Error removing todo:', err)
        throw err
    });
    // return todoService.remove(todoId)
    //     .then(() => {
    //         store.dispatch({type:REMOVE_TODO,todoId})
    //     })
    //     .catch(err => {
    //         console.log('err:', err)
    //         throw err
    //     })
} 

export function saveTodo(todo){
    const type = todo._id ? UPDATE_TODO :ADD_TODO
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({type:type, todo:savedTodo})
            if(savedTodo.isDone){
                // console.log("yes in if")
                increaseUserBalance(10,savedTodo.txt)
            }
            const user = store.getState().userModule.loggedInUser
            if (user) {
                const updatedUser = {
                    ...user,
                    activities: [...user.activities, { txt: `Added Todo: '${savedTodo.txt}'`, at: Date.now() }]
                }
                sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(updatedUser))
                store.dispatch({ type: SET_USER, updatedUser })
                userService.updateUser(updatedUser)
                console.log("User session preserved:", sessionStorage.getItem(STORAGE_KEY_LOGGEDIN));
            }
            return savedTodo
        })
        .catch(err => {
            console.log('err:', err)
            throw err
        })
} 

function increaseUserBalance(amount,todotxt){
    const user = store.getState().userModule.loggedInUser
    if(!user) return


    const newActivity = {
        txt :`Completed todo : ${todotxt}`,
        at : Date.now()
    }
    const updatedUser = {
        ...user , 
        balance : user.balance+amount,
        activities : [...user.activities,newActivity]
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(updatedUser))
    console.log(updatedUser)
    store.dispatch({type:SET_USER , updatedUser})
    userService.updateUser(updatedUser)
    .then(() => console.log("✅ User balance updated:", updatedUser.balance))
    .catch(err => console.error("🚨 Error updating user balance:", err));
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