import * as actionTypes from "./actionTypes";
import axios from "../../axios_base";
import { message } from 'antd';
import firebaseApp from "../../js/firebase";
import userModel from "../../js/models/user";

const onRegisterStart =()=>{
    return{
        type:actionTypes.ON_REGISTER_START
    }
};

const onRegisterSuccess=(id,imageUrl,userName,email,token,isOnline,loggedOutAt)=>{
    return{
        type:actionTypes.ON_REGISTER_SUCCESS,
        userId:id,
        imageUrl:imageUrl,
        userName:userName,
        userMail:email,
        authToken:token,
        isOnline:isOnline,
        loggedOutAt:loggedOutAt
    };
};


const onRegisterFail=()=>{
    return{
        type:actionTypes.ON_REGISTER_FAIL
    };
};

const isRegistered = ()=>{
    return{
        type:actionTypes.IS_REGISTERED
    };
}

export const onRegister=(userData)=>{
    console.log('onRegisterStart');
    return dispatch =>{
        dispatch(onRegisterStart());
        axios.post('/register' , userData).then(res=>{ 
            if(res.data.isRegistered){
                // alert('this mail already taken');
                message.error('This user is registered before, plz login ');
                dispatch(isRegistered());
            }else{
                console.log('status :',res.status); 
                // var token = res.headers['x-auth']; ///fetch x-auth from the header .
                var id = res.data._id;
                var imageUrl=res.data.userImage.url;
                var email = res.data.email;
                var userName = res.data.username;
                var isOnline=res.data.isOnline;
                var loggedOutAt=res.data.loggedOutAt;
                var token = res.data.tokens[0].token;
                console.log('loggedOutAt',loggedOutAt);
                let database = firebaseApp.database();
                let user = userModel(id,imageUrl,userName,email,token,isOnline,false,loggedOutAt);
                database.ref('/users/'+id).set(user).then(()=>{
                    dispatch(isRegistered());
                    dispatch(onRegisterSuccess(id,imageUrl,userName,email,token,isOnline,loggedOutAt));
                    console.log('user added to firebase successfully');
                }).catch((err)=>{
                    console.log('failed to add user to firebase',err);
                });
                
             }      
       }).catch(err=>{
        dispatch(onRegisterFail(err));
        console.log(err);
       });
    }
};