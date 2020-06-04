import { CALC_PROGRESS, RESET_ERROR, ERROR} from './action_types';

export const handlecalculateProgress = (rehabProgress,timesOfAllVideo) => ({ type: CALC_PROGRESS, payload: {rehabProgress,timesOfAllVideo}});

export const calculateProgress = (rehabPlan) => dispatch => {

  const allVideolength = rehabPlan.videos.length;
  let totalTimes = 0;
      let totalLeft = 0;
      for (let video of videos) {
        totalTimes += video.times;
      totalLeft += video.timesLeft;
      }
      
  const rehabProgress = Number((1 - (totalLeft / totalTimes))*100).toFixed(0);

 dispatch(handlecalculateProgress(rehabProgress,totalTimes));
};

