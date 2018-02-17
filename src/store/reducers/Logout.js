import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";


const initialState={
    isAuth:true,
};


const onLogoutStart=(state,action)=>{
    return updateObject(state,{
        loading:true
    });
};

const onLogoutSuccess=(state,action)=>{
    return updateObject(state,{
        isAuth:false
        });
};

const onLogoutFail=(state,action)=>{
    return updateObject(state,{
        loading:false
    });
};

const reducer = (state=initialState,action)=>{
    switch(action.type){
        case actionTypes.ON_LOGOUT_START: return onLogoutStart(state,action);
        case actionTypes.ON_LOGOUT_SUCCESS: return onLogoutSuccess(state,action);
        case actionTypes.ON_LOGOUT_FAIL: return onLogoutFail(state,action);
        default: return state;
    }
};

export default reducer;