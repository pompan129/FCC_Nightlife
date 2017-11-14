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

export const  batchActions = (actions)=>{
  console.log("batchActions");//todo
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
  console.log("setBusinesses");//todo

  return {
    type: SET_BUSINESSES,
    payload: businesses
  }
}

const modifyBusinessGoing = (busid, going)=>{
  console.log("modifyBusinessGoing-action",busid, going);//todo
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
          console.log("fetchBusinesses",term, resp);//todo
          localStorage.setItem("location",location);
          localStorage.setItem("term",term);
          const businesses = resp.data.reduce((accumulator,current)=>{
            const {name,id,url,image_url,display_phone,price,location,going} = current;
            return {...accumulator, [current.id]:{name,id,url,image_url,display_phone,price,location,going}}
          },{});
          callback();
          dispatch(batchActions([setBusinesses(businesses),fecthDone()]));
          console.log("fetchBusinesses(2)",callback);//todo
          //callback();
      })
      .catch(function (error) {
        console.log(error);
        dispatch(batchActions([setErrorMessage(error.message),fecthDone()]));
      });
  }
}

//a thunk
export const addRemoveUserToBusiness = ({busid, username})=>{
    console.log("addRemoveUserToBusiness(1)>>",busid,username)
    return (dispatch, getState) => {
      if(getState().user.authenticated){
          Axios.post('/api/business/modify',{user:username,busid})
          .then(function (resp) {
            if(resp.data.success){
              console.log("addRemoveUserToBusiness(2)",  resp.data);//todo
              //const newBusinesses = getState().businesses;
              //newBusinesses[busid].going =  resp.data.going
              console.log("addRemoveUserToBusiness(3)",  busid,resp.data.going);//todo
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
  console.log("signupUser",email,password);// TODO:
  return (dispatch, getState) => {
    Axios.post('/api/user/signup',{username:email,password})
        .then(function (resp) {
          if(resp.data.success){
            localStorage.setItem('jwt', resp.data.token);
            localStorage.setItem('username', resp.data.username);
            dispatch(batchActions(
              [setAuthentication(true),setUsername(resp.data.username),renderModal(false)]
            ));
          }
        })
        .catch(function (error) {
          console.log("Error>:",error.response.data.error);
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
            localStorage.setItem('username', resp.data.username);
            batch.push(setAuthentication(true));
            batch.push(setUsername(resp.data.username));
            batch.push(setErrorMessage());//set error to Undefined
            batch.push(renderModal(false));
            dispatch(batchActions(batch));
          }else{
            console.log('error.response.data === "else"');
            batch.push(signOut());
            batch.push(setErrorMessage("Not able to authenticate."));
            dispatch(batchActions(batch));
          }
        })
        .catch(function (error) {
          if(error.response.data === "Unauthorized"){
              console.log("signinUser error = ",error.response);
              batch.push(signOut());
              batch.push(setErrorMessage("Oops! Error:" + error.response.status + " " + error.response.statusText));
              dispatch(batchActions(batch));
          }
        });
    }
}

export const signOut=()=>{
  localStorage.removeItem("jwt");
  localStorage.removeItem("username");
  //localStorage.removeItem("term");
  //localStorage.removeItem("location");
  const batch = [];
  batch.push(setAuthentication(false));
  batch.push(setUsername(""));
  return batchActions(batch);
}
