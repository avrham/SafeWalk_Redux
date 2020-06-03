import { AUTHENTICATE,ERROR,RESET_ERROR,RESET_REHAB_FLAG } from './action_types';
import {MARK_VIDEO_EXECUTION} from '../Exercise/action_types'

const initialState = {
    userToken: '',
    patienDetailes:{},
    rehabPlan:{},
    errMessage:'',
    rehabExsist:false
};

export default (state = initialState, action) => {
    
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                userToken: action.payload.userToken,
                patienDetailes:action.payload.patienDetailes,
                rehabPlan:action.payload.rehabPlan,
                rehabExsist:action.payload.rehabExsist
            };
            case ERROR:
            return {
                ...state,
                errMessage: action.payload,
            };
            case RESET_ERROR:
            return {
                ...state,
                errMessage: action.payload.errorMessage,
            };
            case RESET_REHAB_FLAG:
            return {
                ...state,
                rehabExsist: action.payload.rehabExsist
            };
            case MARK_VIDEO_EXECUTION:
                return {
                    ...state,
                    rehabPlan: action.payload.rehabPlan,
                    rehabExsist: action.payload.rehabExsist
                };
           
        default:
            return state;
    }
}