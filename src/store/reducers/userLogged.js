export const initialState = {
    userLogged: ''
}

export default function reducer(state = initialState, action) {
    if(action.type === "USER_LOGGED") {
        return { ...state, userLogged: action.userLogged }
    }
    
    return state;
}