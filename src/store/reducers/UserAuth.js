import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";


const initialState={
    ownerId:null,
    ownerName:null,
    token:null,
    email:null,
    time:2000,
    isAuth:false,
    loading:false
};

const onRegisterStart =(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};



const onRegisterSuccess =(state,action)=>{
    return updateObject(state,{
        ownerId:action.userId,
        ownerName:action.userName,
        email:action.userMail,
        token:action.authToken,
        isAuth:true,
        loading:false,
        time:0
    });
};

const onRegisterFail =(state,action)=>{
    return updateObject(state,{
        isAuth:false,
        loading:false
    });
};

const isRegistered = (state,action) =>{
    return updateObject(state,{
        loading:false
    });
}


const onLoginStart =(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};

const onLoginSuccess =(state,action)=>{
    return updateObject(state,{
        ownerId:action.userId,
        ownerName:action.userName,
        email:action.userMail,
        token:action.authToken,
        isAuth:true,
        loading:false,
        time:0
    });
};

const onLoginFail =(state,action)=>{
    return updateObject(state,{
        isAuth:false,
        loading:false
    });
};



const reducer = (state=initialState,action)=>{
    switch(action.type){
        //register reducers
        case actionTypes.ON_REGISTER_START: return onRegisterStart(state,action);
        case actionTypes.ON_REGISTER_SUCCESS: return onRegisterSuccess(state,action);
        case actionTypes.ON_REGISTER_FAIL: return onRegisterFail(state,action);
        case actionTypes.IS_REGISTERED: return isRegistered(state,action);
        //login reducers
        case actionTypes.ON_LOGIN_START: return onLoginStart(state,action);
        case actionTypes.ON_LOGIN_SUCCESS: return onLoginSuccess(state,action);
        case actionTypes.ON_LOGIN_FAIL: return onLoginFail(state,action);
        default: return state;
    }
};

export default reducer;