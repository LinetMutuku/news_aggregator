import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import articleReducer from './reducers/articleReducer';

const rootReducer = combineReducers({
    articles: articleReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;