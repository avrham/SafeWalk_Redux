import { HANDLE_CLICK, RESET_ERROR, ERROR, HANDLE_PROGRESS, NEW_REHAB, MARK_VIDEO_EXECUTION } from './action_types';
import axios from 'axios';
import config from '../../../config.json'
import mergeByKey from 'array-merge-by-key';


export const handleMarkVideoExecution = (newRehabPlan, newProgress, MergeArray) => {
  console.log('in handle mark exe')
  return {
    type: MARK_VIDEO_EXECUTION,
    payload: {
      rehabPlan: newRehabPlan, progress: newProgress, MergeArray:MergeArray
    }
  };
}

//export const handleSetNewRehab = MergeArray => ({ type: HANDLE_CLICK, payload: MergeArray });

////export const handleProgressProcess = letNewProgress => ({ type: HANDLE_PROGRESS, payload: letNewProgress });

//export const handleResetError = () => ({ type: RESET_ERROR, payload: '' });

export const handleError = errorMessage => ({ type: ERROR, payload: errorMessage });

export const markVideoExecution = (userToken, rehabPlanID, videoId) => async dispatch => {
  let options = {
    method: 'POST',
    url: `${config.SERVER_URL}/rehabPlan/${rehabPlanID}/markVideo`,
    data: {
      videoID: videoId,
    },
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': userToken,
    }
  };
  
  try {
    console.log(options)
    const rehabPlanAfterClick = await axios(options);
    if (!rehabPlanAfterClick.data){
      dispatch(handleMarkVideoExecution(rehabPlanAfterClick.data, 100, []));
    }
    else{
      const videos = rehabPlanAfterClick.data.videos;
      console.log(videos);
      
      let totalTimes = 0;
      let totalLeft = 0;
      for (let video of videos) {
        totalTimes += video.times;
      totalLeft += video.timesLeft;
      }
      const newProgress = (1 - (totalLeft / totalTimes))*100;
      let videoStatusArray=[];
      let videoIds='';
      const length = rehabPlanAfterClick.data.videos.length;
      let i = 0;
      while (i < length) {
        let temp = rehabPlanAfterClick.data.videos[i].videoID;
        videoStatusArray.push({
          id: rehabPlanAfterClick.data.videos[i].videoID,
          Videostatus: rehabPlanAfterClick.data.videos[i].done,
          times: rehabPlanAfterClick.data.videos[i].times,
          priority:rehabPlanAfterClick.data.videos[i].priority,
          timesLeft:rehabPlanAfterClick.data.videos[i].timesLeft,
          priorityNumber:rehabPlanAfterClick.data.videos[i].priority === 'High'? 'a' : rehabPlanAfterClick.data.videos[i].priority === 'Medium'?'b':'c',
        });
        if (i < length - 1) {
            videoIds=`${videoIds}${temp},`;
        } else {
          videoIds=`${videoIds}${temp}`;
        }
        i++;
      }
      options = {
        method: 'GET',
        url: `${config.SERVER_URL}/video?videoIDs=${videoIds}`,
        headers: {
          'x-auth-token': userToken,
        },
      };
        const VideoDetails = await axios(options);
        const MergeArray = mergeByKey(
          'id',
          VideoDetails.data,
          videoStatusArray,
        );
        dispatch(handleMarkVideoExecution(rehabPlanAfterClick.data, newProgress, MergeArray));
    }
  } catch (err) {
    dispatch(handleError(err.message));
  }
}

export const handleProgress = (oldProgress, timesOfAllVideo) => dispatch => {

  let addNumber = (1 / timesOfAllVideo) * 100
  letNewProgress = Number(oldProgress + addNumber).toFixed(1)
  dispatch(handleProgressProcess(letNewProgress));

}

export const resetError = () => dispatch => {
  dispatch(handleResetError());
}