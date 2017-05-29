import {SET_ERROR_MESSAGE} from "../actions";


export default function (state={}, action) {
    switch (action.type) {
        case SET_ERROR_MESSAGE:
          return {...state,error:action.payload};
        default:
          return state;
    }
}
