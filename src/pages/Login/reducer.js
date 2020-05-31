import { AUTHENTICATE,ERROR,RESET_ERROR } from './action_types';

const initialState = {
    userToken: '',
    patienDetailes:null,
    rehabPlan:null,
    errMessage:''
};

export default (state = initialState, action) => {
    
    switch (action.type) {
        case AUTHENTICATE:
            console.log(action.payload.rehabPlan)
            return {
                ...state,
                userToken: action.payload.userToken,
                patienDetailes:action.payload.patienDetailes,
                rehabPlan:action.payload.rehabPlan
            };
            case ERROR:
            return {
                ...state,
                errMessage: action.payload,
            };
            case RESET_ERROR:
            return {
                ...state,
                errMessage: action.payload,
            };
        default:
            return state;
    }
}