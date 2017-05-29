import Axios from "axios";

//Actions
export const SET_AUTHENTICATION = "SET_AUTHENTICATION";
export const SET_USERNAME = "SET_USERNAME";
export const LOG_OUT = "LOG_OUT";
export const BATCH_ACTIONS = "BATCH_ACTIONS";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const SET_BUSINESSES = "SET_BUSINESSES";

export function batchActions(actions) {
   return {
      type: BATCH_ACTIONS,
      payload: actions
   }
}


export const setAuthentication = (auth)=>{
    return {
      type:SET_AUTHENTICATION,
      payload: auth
    }
}

export const setUsername = (name)=>{
    return {
      type:SET_USERNAME,
      payload: name
    }
}

export const setErrorMessage = (message)=>{
  return {
    type: SET_ERROR_MESSAGE,
    payload: message
  }
}

const setBusinesses = (businesses)=>{
  return {
    type: SET_BUSINESSES,
    payload: businesses
  }
}

//a thunk
export const fetchBusinesses = (term, location)=>{
  return (dispatch, getState) => {
    Axios.get('/api/activites/getall',{params:{term,location}})
      .then(function (resp) {
          //console.log(resp.data.businesses);//todo
          const businesses = resp.data.businesses.reduce((accumulator,current)=>{
            return {...accumulator, [current.id]:{name:current.name}}
          },{});
          dispatch(setBusinesses(businesses));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
