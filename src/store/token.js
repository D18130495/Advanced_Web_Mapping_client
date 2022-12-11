let token = {
    // set token to localStorage
    set(token) {
        localStorage.setItem('token', token)
    },
    // get token from localStorage
    get() {
        return localStorage.getItem('token')
    },
    // set username to localStorage
    setUser(user) {
        localStorage.setItem('user', user)
    },
    // get username to localStorage
    getUser() {
        return localStorage.getItem('user')
    },
    // clear username and token from localStorage
    clear() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

export default token
