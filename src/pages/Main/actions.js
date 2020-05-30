import { SOME_ACTION } from './action_types';

export const handleAction = text => ({ type: SOME_ACTION, payload: text });

export const action = text => dispatch => {
  dispatch(handleAction(text));
}