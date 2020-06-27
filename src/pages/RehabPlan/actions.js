import { GET_VIDEO_DETAILES, ERROR,RESET_ERROR,FILTER_DATA } from './action_types';
import axios from 'axios';
import config from '../../../config.json'
import mergeByKey from 'array-merge-by-key';

export const handlegetVideoDetailes = MergeArray => ({ type: GET_VIDEO_DETAILES, payload: MergeArray });

export const handlefilterData = MergeArray => ({ type: FILTER_DATA, payload: MergeArray });

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
        times: rehabPlan.videos[i].times,
        priority:rehabPlan.videos[i].priority,
        timesLeft:rehabPlan.videos[i].timesLeft,
        priorityNumber:rehabPlan.videos[i].priority === 'High'? 'a' : rehabPlan.videos[i].priority === 'Medium'?'b':'c',
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
      dispatch(handleError(err.response.data.message));
    }
    
  }

export const filterData = (MergeArray, filterOption) => async dispatch => {

  const {highCheck,mediumCheck,lowCheack,showDone,inProgress} = filterOption


  const newMergeArray = MergeArray.filter((item)=>{

    if(highCheck&&mediumCheck&&lowCheack&&showDone&&inProgress|| !highCheck&&!mediumCheck&&!lowCheack&&!showDone&&!inProgress){
      return item
    }

    if(showDone && inProgress&& !(highCheck||mediumCheck||lowCheack)){
      if (highCheck && item.priorityNumber === 'a'){
        return item;
      }
      if(mediumCheck && item.priorityNumber ==='b'){
        return item;
      }
      if(lowCheack && item.priorityNumber ==='c'){
        return item;
      }
      else{
        return item;
      }
    }
    if(showDone && inProgress&& (highCheck||mediumCheck||lowCheack)){
      if (highCheck && item.priorityNumber === 'a'){
        return item;
      }
      if(mediumCheck && item.priorityNumber ==='b'){
        return item;
      }
      if(lowCheack && item.priorityNumber ==='c'){
        return item;
      }
    }
 

    if(showDone && (highCheck||mediumCheck||lowCheack) ){
      if (highCheck && item.priorityNumber === 'a' && item.timesLeft===0){
        return item;
      }
      if(mediumCheck && item.priorityNumber ==='b'&& item.timesLeft===0){
        return item;
      }
      if(lowCheack && item.priorityNumber ==='c'&& item.timesLeft===0){
        return item;
      }
    }
    else{
      if(showDone&& !(highCheck||mediumCheck||lowCheack)){
        if (item.timesLeft===0){
          return item
        }
      }
      else{
        if(inProgress && (highCheck||mediumCheck||lowCheack)){
          if (highCheck && item.priorityNumber === 'a' && item.timesLeft!==0){
          return item;
        }
        if(mediumCheck && item.priorityNumber ==='b'&& item.timesLeft!==0){
          return item;
        }
        if(lowCheack && item.priorityNumber ==='c'&& item.timesLeft!==0){
          return item;
        }
      }
      else{
        if(inProgress&& !(highCheck||mediumCheck||lowCheack)){
          if (item.timesLeft!==0){
            return item
          }
        }
        else{
          if (highCheck && item.priorityNumber === 'a'){
            return item;
          }
          if(mediumCheck && item.priorityNumber ==='b'){
            return item;
          }
          if(lowCheack && item.priorityNumber ==='c'){
            return item;
          }
        }
      }
    }
  }
  
    
  })

  dispatch(handlefilterData(newMergeArray));
  
}
export const resetError = () =>  dispatch => {
  dispatch(handleResetError());
}


