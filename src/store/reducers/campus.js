export const initialState = {
    campus: {}
}

export default function reducer(state = initialState, action) {
    if(action.type === "CAMPUS") {
        return { ...state, campus: action.campus }
    }
    
    return state;
}