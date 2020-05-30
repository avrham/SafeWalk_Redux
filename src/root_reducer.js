import { combineReducers } from 'redux';
import login_reducer from './pages/Login/reducer';
import main_reducer from './pages/Main/reducer';
import test_process_reducer from './pages/TestProcess/reducer';
import rehab_plan_reducer from './pages/RehabPlan/reducer';
import exercise_reducer from './pages/Exercise/reducer';
import tests_archive_reducer from './pages/TestsArchive/reducer';

export default combineReducers({
    login: login_reducer,
    main: main_reducer,
    testProcess: test_process_reducer,
    rehabPlan: rehab_plan_reducer,
    exercise: exercise_reducer,
    testsArchive: tests_archive_reducer
});