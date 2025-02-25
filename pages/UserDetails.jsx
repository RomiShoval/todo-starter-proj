const {useSelector,useDispatch} = ReactRedux
const { useEffect , useState } = React
const { useParams } = ReactRouterDOM

import { userService } from "../services/user.service.js"
import { SET_USER } from "../store/reducers/userReducer.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function UserDetails(){
    const dispatch = useDispatch()
    const {userId} = useParams()
    console.log(`userId : ${userId}`)
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)
    console.log(`loggedInUser : ${JSON.stringify(loggedInUser)}`)

    const [user,setUser] = useState(loggedInUser)

    //every time userId change , gey details of current user 
    useEffect(() => {
        if(!loggedInUser || loggedInUser._id !== userId){
            userService.getById(userId)
                .then(fetchedUser => {
                    console.log(`fetchedUser : ${JSON.stringify(fetchedUser)}`)
                    setUser({
                        ...fetchedUser, 
                        pref: fetchedUser.pref || { color: '#000000', bgColor: '#ffffff' } 
                    })
                })
                .catch(() => showErrorMsg("Cannot load user details"))
        }

    },[userId , loggedInUser])

    useEffect(() => {
        if (loggedInUser && loggedInUser.pref) {
            document.body.style.color = user.pref.color
            document.body.style.backgroundColor = user.pref.bgColor
        }
        else{
            document.body.style.color = "black"
            document.body.style.backgroundColor = "white"
        }
    }, [loggedInUser])

    function handleChange({target}){
        const {name,value} = target
        setUser(prevUser => ({
            ...prevUser,
            [name] : name === "fullname" ? value : prevUser[name],
            pref:{...prevUser.pref || {},[name]:value}}))
    }

    function onSaveUser() {
        userService.updateUser(user)
            .then(updatedUser => {
                dispatch({ type: SET_USER, user: updatedUser });
                showSuccessMsg("Preferences updated!");
            })
            .catch(() => showErrorMsg("Failed to update user"));
    }

    // if (!user) return <p>Loading user details...</p>;

    return (
        <section className="user-details">
            <h2>Profile</h2>
            <label>Name: 
                <input 
                    type="text" 
                    value={user.fullname ? user.fullname : ""} />
                    </label>
            <label>Color: 
                <input 
                    type="color" 
                    name="color" 
                    value={user.pref.color ? user.pref.color :"#000000"} 
                    onChange={handleChange} />
                    </label>
            <label>BG Color: 
                <input 
                    type="color" 
                    name="bgColor" 
                    value={user.pref.bgColor ?user.pref.bgColor :"#000000"} 
                    onChange={handleChange} />
                    </label>
            <button onClick={onSaveUser}>Save</button>

            <h3>Activity Log</h3>
            <ul>
                {user.activities.length ? 
                    user.activities.map((acttivity, idx) => (
                        <li 
                            key={idx}>
                                {new Date(acttivity.at).toLocaleString()} - {acttivity.txt}
                                </li>
                )) : <p>No activities yet</p>}
            </ul>
        </section>
    )
}