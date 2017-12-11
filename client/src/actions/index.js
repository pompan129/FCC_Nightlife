import Axios from "axios";

//Actions
export const SET_AUTHENTICATION = "SET_AUTHENTICATION";
export const SET_USERNAME = "SET_USERNAME";
export const RENDER_MODAL = "RENDER_MODAL";
export const LOG_OUT = "LOG_OUT";
export const BATCH_ACTIONS = "BATCH_ACTIONS";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const SET_BUSINESSES = "SET_BUSINESSES";
export const FETCHING_START = "FETCHING_STSART";
export const FETCHING_DONE = "FETCHING_DONE";
export const MODIFY_BUSINESS_GOING = "MODIFY_BUSINESS_GOING";
export const SET_AUTH_ERROR = "SET_AUTH_ERROR";
export const AUTH_JWT = "AUTH_JWT";
export const LOGIN_USER_JWT = "LOGIN_USER_JWT"

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

export const setAuthErrorMessage = (message)=>{
  return {
    type: SET_AUTH_ERROR,
    payload: message
  }
}

const setBusinesses = (businesses)=>{
  return {
    type: SET_BUSINESSES,
    payload: businesses
  }
}

const modifyBusinessGoing = (busid, going)=>{
  return {
    type: MODIFY_BUSINESS_GOING,
    payload: {busid, going}
  }
}

export const renderModal = (modalType)=>{
  return {
    type: RENDER_MODAL,
    payload: modalType
  }
}

export const fecthStart = ()=>{
  return{type:FETCHING_START}
}

export const fecthDone = ()=>{
  return{type:FETCHING_DONE}
}

export const LoginUser_JWT=(jwt,username)=>{
  localStorage.setItem("jwt",jwt);
  return {
    type: LOGIN_USER_JWT,
    payload: username
  }
}

//a thunk
export const authRefreshJWT = (token)=>{
  return (dispatch, getState) => {

    if(!token){
      dispatch(batchActions([setUsername(""), setAuthentication(false)]));
    }

    //start spinner
    dispatch(fecthStart());

    //verify token w API
    Axios.get('/api/auth/refresh/jwt',{params:{token}, headers:{"Authorization":"Bearer " + token}})
      .then((resp)=>{
        dispatch(batchActions([setUsername(resp.data.username), setAuthentication(true),renderModal(false),fecthDone()]));
        localStorage.setItem("jwt",token);
      })
      .catch(function (error){
          dispatch(batchActions([setUsername(""), setAuthentication(false),setErrorMessage(error.message),fecthDone()]));

        });
  }
}

//a thunk
export const fetchBusinesses = (term, location,callback)=>{
  return (dispatch, getState) => {

    if(!term || !location){
      dispatch(setErrorMessage("Location/Term Not Valid"));
      return;
    }

    dispatch(batchActions([setBusinesses({}),fecthStart()]));

    Axios.get('/api/businesses/getall',{params:{term,location}})
      .then(function (resp) {
          localStorage.setItem("location",location);
          localStorage.setItem("term",term);
          const businesses = resp.data.reduce((accumulator,current)=>{
            const {name,id,url,image_url,display_phone,price,location,going} = current;
            return {...accumulator, [current.id]:{name,id,url,image_url,display_phone,price,location,going}}
          },{});
          callback();
          dispatch(batchActions([setBusinesses(businesses),fecthDone()]));
          //callback();
      })
      .catch(function (error) {
        console.log(error);
        dispatch(batchActions([setErrorMessage(error.message),fecthDone()]));
      });
  }
}

//a thunk
export const addRemoveUserToBusiness = (busid)=>{
    return (dispatch, getState) => {
      if(getState().user.authenticated  && getState().user.username){
          Axios.post('/api/business/modify',{user:getState().user.username,busid})
          .then(function (resp) {
            if(resp.data.success){
              dispatch(modifyBusinessGoing(busid,resp.data.going));
            }
          })
          .catch(function (error) {
            console.log("Error>:",error);
          });
      }
      else{dispatch(setErrorMessage("Must be signed in to to register at a business"))}
    }
}

//a thunk
export const signupUser = ({email,password})=>{
  const batch = [];
  return (dispatch, getState) => {
    Axios.post('/api/user/signup',{username:email,password})
        .then(function (resp) {
          if(resp.data.success){
            localStorage.setItem('jwt', resp.data.token);
            dispatch(batchActions(
              [setAuthErrorMessage(),setAuthentication(true),setUsername(resp.data.username),renderModal(false)]
            ));
          }
        })
        .catch(function (error) {
              console.log("signupUserError> ",error.response);
              batch.push(signOut());
              batch.push(setAuthErrorMessage(error.response.data.error));
              dispatch(batchActions(batch));
        });
    }
}

//a thunk
export const signinUser = ({email,password})=>{
  return (dispatch, getState) => {
    const batch = [];
    Axios.post('/api/user/signin',{username:email,password})
        .then(function (resp) {
          if(resp.data.success){
            localStorage.setItem('jwt', resp.data.token);
            batch.push(setAuthentication(true));
            batch.push(setUsername(resp.data.username));
            batch.push(setAuthErrorMessage());//set error to Undefined
            batch.push(renderModal(false));
            dispatch(batchActions(batch));
          }else{
            batch.push(signOut());
            batch.push(setAuthErrorMessage("server error.Not able to authenticate."));
            dispatch(batchActions(batch));
          }
        })
        .catch(function (error) {
          if(error.response.data === "Unauthorized"){
              console.log("signinUser error = ",error.response);
              batch.push(signOut());
              batch.push(setAuthErrorMessage(`Oops! ${error.response.status} ${error.response.statusText}`));
              dispatch(batchActions(batch));
          }
        });
    }
}

export const signOut=()=>{
  localStorage.removeItem("jwt");
  const batch = [];
  batch.push(setAuthentication(false));
  batch.push(setUsername(""));
  return batchActions(batch);
}
