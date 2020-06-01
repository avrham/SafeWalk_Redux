import { HANDLE_CLICK, RESET_ERROR, ERROR, HANDLE_PROGRESS } from './action_types';
import axios from 'axios';
import config from '../../../config.json'

export const handleDoneClick = newRehabPlan => ({ type: HANDLE_CLICK, payload: newRehabPlan });

export const handleProgressProcess = letNewProgress => ({ type: HANDLE_PROGRESS, payload: letNewProgress });

export const handleResetError = () => ({ type: RESET_ERROR, payload: '' });

export const handleError = errorMessage => ({ type: ERROR, payload: errorMessage });

export const handleClick = (userToken, rehabPlanID, videoId) => async dispatch => {

  let options = {
    method: 'POST',
    url: `${config.SERVER_URL}/rehabPlan/${rehabPlanID
      }/markVideo`,
    data: {
      videoID: videoId,
    },
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': userToken,
    },
  };
  try {
    const rehabPlanAfterClick = await axios(options);
    dispatch(handleDoneClick(rehabPlanAfterClick.data));
  } catch (err) {
    dispatch(handleError(err.message));
  }
}
export const handleProgress = (oldProgress, timesOfAllVideo) =>  dispatch => {
  
  let addNumber = (1/timesOfAllVideo)*100
  letNewProgress = Number(oldProgress + addNumber).toFixed(1)
    dispatch(handleProgressProcess(letNewProgress));
 
}

export const resetError = () =>  dispatch => {
  dispatch(handleResetError());
}