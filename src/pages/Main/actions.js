import { CALC_PROGRESS, RESET_ERROR, ERROR} from './action_types';

export const handlecalculateProgress = (rehabProgress,timesOfAllVideo) => ({ type: CALC_PROGRESS, payload: {rehabProgress,timesOfAllVideo}});

export const calculateProgress = (rehabPlan) => dispatch => {

  const allVideolength = rehabPlan.videos.length;
  let timesOfAllVideo = 0;
  let timesLeft = 0;
  for (let i = 0; i < allVideolength; i++) {
    timesOfAllVideo = timesOfAllVideo + rehabPlan.videos[i].times;
    timesLeft = timesLeft + rehabPlan.videos[i].timesLeft;
  }
  const rehabProgress = Math.floor(Math.floor(((timesOfAllVideo - timesLeft) / timesOfAllVideo)* 100));

 dispatch(handlecalculateProgress(rehabProgress,timesOfAllVideo));
};

