import Axios from "axios";

//Actions
export const SET_AUTHENTICATION = "SET_AUTHENTICATION";
export const SET_USERNAME = "SET_USERNAME";
export const LOG_OUT = "LOG_OUT";
export const BATCH_ACTIONS = "BATCH_ACTIONS";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const SET_BUSINESSES = "SET_BUSINESSES";
export const FETCHING_START = "FETCHING_STSART";
export const FETCHING_DONE = "FETCHING_DONE";

export const  batchActions = (actions)=>{
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

export const fecthStart = ()=>{
  return{type:FETCHING_START}
}

export const fecthDone = ()=>{
  return{type:FETCHING_DONE}
}


//a thunk
export const fetchBusinesses = (term, location,callback)=>{
  return (dispatch, getState) => {
    dispatch(batchActions([setBusinesses({}),fecthStart()]));
    Axios.get('/api/businesses/getall',{params:{term,location}})
      .then(function (resp) {
          console.log("fetchBusinesses",term,resp.data.businesses);//todo
          const businesses = resp.data.businesses.reduce((accumulator,current)=>{
            const {name,id,url,image_url,display_phone,price,location} = current;
            return {...accumulator, [current.id]:{name,id,url,image_url,display_phone,price,location}}
          },{});
          dispatch(batchActions([setBusinesses(businesses),fecthDone()]));
          callback();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
