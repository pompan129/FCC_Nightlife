import {SET_BUSINESSES} from "../actions";

export default function (state={},action) {
    switch (action.type) {
        case SET_BUSINESSES:
          return action.payload;
        default:
          return state;

    }
}
