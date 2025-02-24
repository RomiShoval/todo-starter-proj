const { useState ,useEffect} = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const {useSelector,useDispatch} = ReactRedux

import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import {logout} from '../store/actions/user.actions.js'
import { SET_USER } from '../store/reducers/userReducer.js'



export function AppHeader() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const user = useSelector(storeState => storeState.userModule.loggedInUser)

    const todos = useSelector(state => state.toDoModule.todos)
    const completedTodos = todos.filter(todo => todo.isDone).length
    const totalTodos = todos.length
    const precentageTodos = totalTodos ? Math.round((completedTodos/totalTodos)*100) : 0

    useEffect(() =>{
        const storedUser = userService.getLoggedinUser()
        if(storedUser && (!user || storedUser.balance!==user.balance)){
            dispatch({type : SET_USER, user:storedUser})
        }
    },[user,dispatch])
    
    function onLogout() {
        logout()
            .then(() => {showSuccessMsg('Logout successfully')})
            .catch(() => {showErrorMsg('OOPs try again')})
    }

    function onSetUser(user) {
        // setUser(user)
        dispatch({type: SET_USER , user})
        navigate('/')
    }
    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section >

                        <Link to={`/user/${user._id}`}>Hello {user.fullname} - Balance {user.balance}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>

            <section className="progress-bar-container">
                <label>Progress : {precentageTodos}%</label>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${precentageTodos}%` }}></div>
                </div>
            </section>
            <UserMsg />
        </header>
    )
}
