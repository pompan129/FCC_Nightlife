import {SET_ERROR_MESSAGE,FETCHING_START,FETCHING_DONE} from "../actions";


export default function (state={}, action) {
    switch (action.type) {
        case SET_ERROR_MESSAGE:
          return {...state,error:action.payload};
        case FETCHING_START:
          return {...state,fetching:true};
        case FETCHING_DONE:
          return {...state,fetching:false};
        default:
          return state;
    }
}
