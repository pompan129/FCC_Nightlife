import {SET_BUSINESSES, MODIFY_BUSINESS_GOING} from "../actions";



export default function (state={},action) {
  console.log("businessReducer",state,action);//todo

    switch (action.type) {
        case MODIFY_BUSINESS_GOING:
          const newState = {...state, [action.payload.busid]:{...state[action.payload.busid],going:action.payload.going}};
          console.log("businessReducer-2",newState,state[action.payload.busid]);//todo
          return newState;
        case SET_BUSINESSES:
          return action.payload;
        default:
          return state;

    }
}
