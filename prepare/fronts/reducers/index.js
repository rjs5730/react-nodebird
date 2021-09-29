import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// HIDRATE 가 root로 올라와야된다.
// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         console.log('HYDRATE', action);
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return { ...state, ...action.payload };
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
