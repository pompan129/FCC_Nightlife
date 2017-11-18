import {SET_AUTHENTICATION,SET_USERNAME,SET_AUTH_ERROR} from "../actions";

export default function (state={authenticated:false,username:""}, action) {
    switch (action.type) {
        case SET_AUTHENTICATION:
          return {...state,authenticated:action.payload};
        case SET_AUTH_ERROR:
          return { ...state, error: action.payload };
        case SET_USERNAME:
          return {...state,username:action.payload};
        default:
          return state;

    }
}
