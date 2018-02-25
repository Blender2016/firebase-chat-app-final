import * as actionTypes from "./actionTypes";
import axios from "../../axios_base";
import firebaseApp from "../../js/firebase";


const onUpdateStart=()=>{
    return{
        type:actionTypes.ON_UPDATE_START
    }
};
const onUpdateFail=()=>{
    return{
        type:actionTypes.ON_UPDATE_FAIL
    }
};
const onUpdateSuccess=(userName,userImage)=>{
    return{
        type:actionTypes.ON_UPDATE_SUCCESS,
        userName:userName,
        userImage:userImage
    }
};


export const onProfileUpdate=(newData)=>{
    console.log('onUpdate :',newData);
    return dispatch=>{
        dispatch(onUpdateStart());
        axios.patch('/updateprofile',newData).then(res=>{
            console.log('user updated successfully');
            let id = res.data._id;
            let username = res.data.username;
            let userImage = res.data.userImage.url;
            //update username and image url  in firebase
            firebaseApp.database().ref('/users/'+id).update({
                name:username,
                imageUrl:userImage
            });
            dispatch(onUpdateSuccess(username,userImage));
        }).catch(err=>{
            console.log('userlogout failed');
            dispatch(onUpdateFail());
        });
    }
};