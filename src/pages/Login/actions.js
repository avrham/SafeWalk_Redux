import { AUTHENTICATE, ERROR,RESET_ERROR,RESET_REHAB_FLAG } from './action_types';
import axios from 'axios';
import config from '../../../config.json'



export const handleAuthenticate = (userToken, patienDetailes, rehabPlan, rehabExsist) => ({ type: AUTHENTICATE, payload: {userToken, patienDetailes, rehabPlan, rehabExsist} });

export const handleResetError = () => ({ type: RESET_ERROR, payload: '' });

export const handleResetRehabPlag = (rehabExsist) => ({ type: RESET_REHAB_FLAG, payload: {rehabExsist} });

export const handleError = errorMessage => ({ type: ERROR, payload: errorMessage});


export const authenticate = (user_name, password) => async dispatch => {
  const m2= 'aneeman2010@gmail.com'
  const p = '123456'

  let options = {
    method: 'post',
    url: `${config.SERVER_URL}/auth/login`,
    data: {
      //mail: m2,
      //password: p,
      mail: user_name,
      password: password,
    }
  };
  try {
    const loginDetails = await axios(options);
    const userToken  = loginDetails.data.token
    
    const patientId = loginDetails.data.id
    options = {
      url: `${config.SERVER_URL}/patient/${patientId}`,
      headers: {
        'x-auth-token': userToken,
      },
    };
    const patienDetailes = await axios(options);

    if (!(patienDetailes.data.rehabPlanID==="")) {
      const rehabPlanId = patienDetailes.data.rehabPlanID;
      options = {
        url: `${config.SERVER_URL}/rehabPlan/${rehabPlanId}`,
        headers: {
          'x-auth-token': userToken,
        },
      };
      const rehabPlan = await axios(options);
      dispatch(handleAuthenticate(userToken, patienDetailes.data,rehabPlan.data, true));
    }
    else{
      dispatch(handleAuthenticate(userToken, patienDetailes.data, {}, false));
    }
  }
  catch (err) {
    console.log(err);
    
    dispatch(handleError(err.response.data.message));
    throw new Error(err.response.data.message)
  }
}

export const resetError = () =>  dispatch => {
  dispatch(handleResetError());
}

export const resetRehabFlag = () =>  dispatch => {
  dispatch(handleResetRehabPlag(false));
}



