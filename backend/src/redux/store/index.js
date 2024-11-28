import { createStore, applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk'
import { createWrapper } from 'next-redux-wrapper'
import rootReducer from '../reducers'
import AsyncMiddleware from '../reducers/middleware/async';
// const _getMiddleware = () => {
//     const asyncMiddleware = new AsyncMiddleware().create();
//     return [thunk, asyncMiddleware];
// };
// const middleware = _getMiddleware();
// const composedMiddlewares = applyMiddleware(...middleware);
// const store = createStore(rootReducer, composedMiddlewares);

const asyncMiddleware = new AsyncMiddleware().create();

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(asyncMiddleware),
});


// export default store;
export default store;