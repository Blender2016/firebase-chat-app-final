import React, {Component} from "react";
import { Form, Input, Button } from 'antd';
import messageModel from "../js/models/message";
import {connect} from "react-redux";
import topbar from "topbar";
// import userModel from "../js/models/user";
import firebaseApp from "../js/firebase";


const FormItem = Form.Item;

class MessageBox  extends Component{

      state={
        message:''
    };

    sendClickedHandler=(e)=>{
        this.onKeyUpClicked();
        e.preventDefault();
        topbar.show();
        // let messageId = this.props.db.ref(`/${this.props.chatId}/`).push().key;
        let message = messageModel(this.props.ownerId,this.state.message);
        this.props.db.ref(`/${this.props.chatId}`).push(message).then(()=>{
            topbar.hide();
            console.log('message sent');
        }).catch((err)=>{
            topbar.hide();
            console.log('message failed',err);
        });

            this.newMessageAdded();

        this.setState({
            message:''
        });
    };

    newMessageAdded=()=>{

        let chatWith; 
        firebaseApp.database().ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);
        console.log('chatId********************************]>>>>>>>>',this.props.chatId);
        console.log('//***********************>>>{}>>>>', chatWith.find(item => item.chatId === this.props.chatId));
        chatWith.find(item => item.chatId === this.props.chatId).unread++;
        console.log('chatWith:---------------------->>>>>',chatWith);
        // chatWith[itemIndex].unread++

        firebaseApp.database().ref('/users/'+this.props.ownerId).update({
            chatWith:chatWith
        });
    }

    onKeyDownClicked=()=>{
         //update isTyping from firebase
         console.log('key down');
         firebaseApp.database().ref('/users/'+this.props.ownerId).update({
            isTyping:true
        });
    }
    onKeyUpClicked=()=>{
        //update isTyping from firebase
        console.log('key up');
        firebaseApp.database().ref('/users/'+this.props.ownerId).update({
           isTyping:false
       });
   }

//    allMessagesAreReaded = ()=>{
//     let chatWith; 
//     firebaseApp.database().ref(`/users/${this.props.otherId}/chatWith/`).on('value',(snapshot)=>{
//         chatWith = snapshot.val();
//     });
//     let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);

    
//     console.log('chatWith:',chatWith[itemIndex]);
//     if(itemIndex !== -1){
//         chatWith[itemIndex].unread = 0;
//     }
//     firebaseApp.database().ref('/users/'+this.props.ownerId).update({
//         chatWith:chatWith
//     });
//    }

userReadAllMessages=()=>{
    if(this.props.otherId){
        let chatWith; 
        firebaseApp.database().ref(`/users/${this.props.otherId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);

        chatWith.find(item => item.otherId === this.props.ownerId).unread = 0;
        // console.log('chatWith:',chatWith[itemIndex]);
        // if(itemIndex !== -1){
        //     chatWith[itemIndex].unread = 0;
        // }
        firebaseApp.database().ref('/users/' + this.props.otherId).update({
            chatWith:chatWith
        }); 
    }
}

    inputChangeHandler=(e)=>{
        this.onKeyDownClicked();
        let message = e.target.value;
        if (message.trim() !== ''){
            this.setState({
                message:message,
                isOpen:true
            });
        }
        this.userReadAllMessages();
    };

    render(){

        return (
            <Form layout="inline" onSubmit={this.sendClickedHandler}>
                <FormItem >
                <Input 
                placeholder="Enter your message" 
                style={{width:'760px'}} 
                size="large"
                value={this.state.message}
                onChange={this.inputChangeHandler}
                // onKeyDown={this.onKeyDownClicked}
                // onKeyUp={this.onKeyUpClicked}
                />
                </FormItem>
                <FormItem>
                <Button
                    type="default"
                    htmlType="submit"
                    size="large"
                >
                    Send
                </Button>
                </FormItem>
            </Form>
            );
        }
    }

const mapStateToProps = state=>{
    return{
        ownerId:state.UserAuth.ownerId
    }
};
export default connect(mapStateToProps)(MessageBox);