import {SET_BUSINESSES, MODIFY_BUSINESS_GOING} from "../actions";



export default function (state={},action) {
    switch (action.type) {
        case MODIFY_BUSINESS_GOING:
          const newState = {...state, [action.payload.busid]:{...state[action.payload.busid],going:action.payload.going}};
          return newState;
        case SET_BUSINESSES:
          return action.payload;
        default:
          return state;

    }
}
