let token = {
    set(token) {
        localStorage.setItem('token', token)
    },
    get() {
        return localStorage.getItem('token')
    },
    setUser(user) {
        localStorage.setItem('user', user)
    },
    getUser() {
        return localStorage.getItem('user')
    },
    clear() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}

export default token
