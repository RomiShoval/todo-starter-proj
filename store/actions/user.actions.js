import { userService } from "../../services/user.service.js";
import { SET_USER } from "../reducers/userReducer.js";
import { store } from "../store.js";

export function logout(){
    return userService.logout()
        .then(() => {
            store.dispatch({type:SET_USER , user:null})
            document.body.style.color = "black";      
            document.body.style.backgroundColor = "white"; 
        })
        .catch(err => console.log(err))
}