import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    updateUser
}
export const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user ={
        username,
        password,
        fullname,
        createdAt : Date.now(),
        updatedAt : Date.now(),
        balance :10000,
        activities : [],
        pref : {color : 'black', bgColor : 'white'}
    }
    // const user = { username, password, fullname }
    // user.createdAt = user.updatedAt = Date.now()
    // user.balance = 10000
    // user.activities = []
    // user.pref = {color: 'black', bgColor: 'white'}
    
    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN);
    if (!user) return null; 

    try {
        return JSON.parse(user); 
    } catch (err) {
        console.error("Error parsing user from sessionStorage:", err);
        return null;
    }
}

function _setLoggedinUser(user) {
    const userToSave = { 
        _id: user._id, 
        fullname: user.fullname , 
        balance :user.balance || 10000,
        activities: user.activities || [],
        pref : user.pref || {color : 'black', bgColor : '#ffffff'}

     }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function updateUser(updatedUser){
    return storageService.put(STORAGE_KEY,updatedUser).then(() =>{
        sessionStorage.setItem(STORAGE_KEY_LOGGEDIN,JSON.stringify(updatedUser))
        return updatedUser
    })
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }