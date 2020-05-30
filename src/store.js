import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import root_reducer from './root_reducer';

const initialState = {};
const middleware = applyMiddleware(thunk);
const composedEnhancers = compose(middleware);
const store = createStore(root_reducer, initialState, composedEnhancers);

export default store;