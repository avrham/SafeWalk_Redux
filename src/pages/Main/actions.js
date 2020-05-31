import { CALC_PROGRESS, RESET_ERROR, ERROR} from './action_types';

export const handlecalculateProgress = (rehabProgress,timesOfAllVideo) => ({ type: CALC_PROGRESS, payload: {rehabProgress,timesOfAllVideo}});

export const handleResetError = () => ({ type: RESET_ERROR, payload: '' });


export const handleError = errorMessage => ({ type: ERROR, payload: errorMessage});

export const calculateProgress = (rehabPlan) => dispatch => {

  const allVideolength = rehabPlan.videos.length;
  let timesOfVideo = 0;
  let timesLeft = 0;
  let i, j;
  for (i = 0, j = 0; i < allVideolength; i++) {
    timesOfVideo = timesOfVideo + rehabPlan.videos[i].times;
    timesLeft = timesLeft + rehabPlan.videos[i].timesLeft;
  }
 const rehabProgress = Number(((1 - (timesLeft / timesOfVideo)) * 100).toFixed(1));
 const timesOfAllVideo = timesOfVideo;

 dispatch(handlecalculateProgress(rehabProgress,timesOfAllVideo));
};



export const resetError = () =>  dispatch => {
  dispatch(handleResetError());
}
