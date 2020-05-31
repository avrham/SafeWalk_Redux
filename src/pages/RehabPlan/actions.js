import { GET_VIDEO_DETAILES, ERROR,RESET_ERROR } from './action_types';
import axios from 'axios';
import config from '../../../config.json'
import mergeByKey from 'array-merge-by-key';

export const handlegetVideoDetailes = MergeArray => ({ type: GET_VIDEO_DETAILES, payload: MergeArray });

export const handleResetError = () => ({ type: RESET_ERROR, payload: '' });


export const handleError = errorMessage => ({ type: ERROR, payload: errorMessage});

export const getVideoDetailes = (userToken, rehabPlan) => async dispatch => {
  
    let videoStatusArray=[];
    let videoIds='';
    const length = rehabPlan.videos.length;
    let i = 0;
    while (i < length) {
      let temp = rehabPlan.videos[i].videoID;
      videoStatusArray.push({
        id: rehabPlan.videos[i].videoID,
        Videostatus: rehabPlan.videos[i].done,
        times: rehabPlan.videos[i].timesLeft,
        priority:rehabPlan.videos[i].priority,
        timesLeft:rehabPlan.videos[i].timesLeft
      });
      if (i < length - 1) {
          videoIds=`${videoIds}${temp},`;
      } else {
        videoIds=`${videoIds}${temp}`;
      }
      i++;
    }
    let options = {
      method: 'GET',
      url: `${config.SERVER_URL}/video?videoIDs=${videoIds}`,
      headers: {
        'x-auth-token': userToken,
      },
    };
    try {
      const VideoDetails = await axios(options);
      const MergeArray = mergeByKey(
        'id',
        VideoDetails.data,
        videoStatusArray,
      );
      dispatch(handlegetVideoDetailes(MergeArray));
    } catch (err) {
      dispatch(handleError(err.message));
    }
    
  }

  export const resetError = () =>  dispatch => {
    dispatch(handleResetError());
  }


