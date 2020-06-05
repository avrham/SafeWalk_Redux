import { GET_ALL_TESTS,ERROR, RESET_ERROR } from './action_types';
import axios from 'axios';
import config from '../../../config.json';
import Moment from 'moment';


export const handlegetAllTests = getAllTests => ({ type: GET_ALL_TESTS, payload: getAllTests });

export const handleResetError = () => ({ type: RESET_ERROR, payload: '' });

export const handleError = errorMessage => ({ type: ERROR, payload: errorMessage});

export const getTestArchive = (userToken,patienId) => async dispatch => {
  let options = {
    method: 'GET',
    url: `${config.SERVER_URL}/test/patient/${patienId}`,
    headers: {
      'x-auth-token': userToken,
    },
  };
  try{
    const getAllTests = await axios(options);
    let length = getAllTests.data.length;
    for(let i=0; i<length; i++){
      getAllTests.data[i].date=Moment(getAllTests.data[i].date).format('DD-MM-YYYY HH:mm')
    }
   
    dispatch(handlegetAllTests(getAllTests.data));
  }
  catch(err){
    console.log(err.response.data.message)
    dispatch(handleError('Server Error, please try again'));
  }
}

export const resetError = () =>  dispatch => {
  dispatch(handleResetError());
}