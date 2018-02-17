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

const onRegisterSuccess=(id,userName,email,token)=>{
    return{
        type:actionTypes.ON_REGISTER_SUCCESS,
        userId:id,
        userName:userName,
        userMail:email,
        authToken:token
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
                var email = res.data.email;
                var userName = res.data.username;
                var token = res.data.tokens[0].token;
                
                let database = firebaseApp.database();
                let user = userModel(id,userName,email,token,[]);
                database.ref('/users/'+id).set(user).then(()=>{
                    console.log('user added to firebase successfully');
                }).catch((err)=>{
                    console.log('failed to add user to firebase',err);
                });
                dispatch(onRegisterSuccess(id,userName,email,token));
             }      
       }).catch(err=>{
        dispatch(onRegisterFail(err));
        console.log(err);
       });
    }
};