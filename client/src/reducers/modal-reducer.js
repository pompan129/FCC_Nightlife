import {RENDER_MODAL} from "../actions";


export default function (state={}, action) {
    switch (action.type) {
        case RENDER_MODAL:
          return {...state,type:action.payload};
        default:
          return state;
    }
}
