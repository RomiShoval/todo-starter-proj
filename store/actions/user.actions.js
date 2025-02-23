import { userService } from "../../services/user.service.js";
import { SET_USER } from "../reducers/userReducer.js";
import { store } from "../store.js";

export function logout(){
    return userService.logout()
        .then(() => store.dispatch({type:SET_USER , user:null}))
        .catch(err => console.log(err))
}