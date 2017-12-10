import {RENDER_MODAL} from "../actions";


export default function (state={}, action) {
   console.log("RENDER_MODAL",action.payload)
    switch (action.type) {
        case RENDER_MODAL:
          return {...state,type:action.payload};
        default:
          return state;
    }
}
