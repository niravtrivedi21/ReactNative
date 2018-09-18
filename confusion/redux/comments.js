import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      if (state.comments.some(el => el === action.payload))
        return { ...state, errMess: null, comments: action.payload };
      else
        return { ...state, errMess: null, comments: state.comments.concat(action.payload) };

    case ActionTypes.COMMENTS_FAILED:
      return { ...state, errMess: action.payload };


    default:
      return state;
  }
};