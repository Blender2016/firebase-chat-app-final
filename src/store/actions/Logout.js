import * as actionTypes from "./actionTypes";
import axios from "../../axios_base";
import firebaseApp from "../../js/firebase";


const onLogoutStart=()=>{
    return{
        type:actionTypes.ON_LOGOUT_START
    }
};
const onLogoutFail=()=>{
    return{
        type:actionTypes.ON_LOGOUT_FAIL
    }
};
const onLogoutSuccess=()=>{
    return{
        type:actionTypes.ON_LOGOUT_SUCCESS
    }
};


export const onLogout=(authToken,id)=>{
    console.log('blender :',authToken);
    return dispatch=>{
        //delete token from db
        dispatch(onLogoutStart());
        axios.delete('/logout',{ headers: { 'X-auth':authToken } }).then(res=>{
            console.log('user logout successfully');
            firebaseApp.database().ref('/users').child(id).once('value', (snapshot)=> {
                if(snapshot.val() !== null){
                    //update is online from firebase
                    firebaseApp.database().ref('/users/'+id).update({
                        isOnline:false,
                        loggedOutAt:Date.now()
                    });
                }
              });            
            dispatch(onLogoutSuccess());
        }).catch(err=>{
            console.log('userlogout failed');
            dispatch(onLogoutFail());
        });
        //dispatch an action to remove token from global store
    }
};