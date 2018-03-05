import React, {Component} from "react";
import { Layout, notification,Button } from 'antd';
// import { Layout } from 'antd';

// import Message from "../../components/Message/Message";
import UserList from "../../components/UserList/UserList";
import MessageBox from "../../components/MessageBox";
// import topbar from "topbar";
import axios from "../../axios_base";
// import styles from "./Chat.module.css";
import MessageList from "../../components/MessageList/MessageList";
import {connect} from "react-redux";
import firebaseApp from "../../js/firebase";
// import uuidv4 from "uuid/v4";
import {withRouter} from "react-router-dom";
import * as actionCreators from "../../store/actions/index";
import _ from "lodash";
// import {getUserData} from "../js/localStorage";
import messageModel from "../../js/models/message";
// import userModel from "../../js/models/user";
import notificationModel from "../../js/models/notification";


var database= firebaseApp.database();

const { Content,Footer} = Layout;

class Chat extends Component{
    state={
        users:[],
        messages:[],
        chatId:null,
        notificationId:null,
        otherId:null
    };


     componentWillMount(){
        console.log('before auth',this.props.ownerId,this.props.token);
            axios.get(`/user/${this.props.ownerId}`,{ headers: { 'X-auth':this.props.token } }).then(res=>{
                console.log(res.data);
                console.log('owner-id',this.props.ownerId);
                    database.ref('/users').on('value',(snapshot)=>{
                        if(snapshot.val() !== null){
                            this.getAllUsers(snapshot.val());
                        }
                    });
    
    
    
                    //list all messages added in the current chat id
                    if(this.state.chatId !==null){
                        let app = database.ref(`${this.state.chatId}`);
                        app.on('value', snapshot => {
                            if(snapshot.val() !== null){
                                this.getAllData(snapshot.val());
                            }
                        
                        });
                    }
    
                    //  listen to all changes in notifications model
                    database.ref('/notifications').on('value',(snapshot)=>{
                        if(snapshot.val() !== null){
                            this.getAllNotifications(snapshot.val());
                        }
                    });


                this.onlineUser();
            }).catch(err=>{
                console.log('err [not authenticated]',err);
                this.props.history.push('/login');
            });
    }




   getAllNotifications=(values)=>{
    let notificationsVal = values;
    console.log('before mapping',notificationsVal);
    let notificationsArr = Object.keys(notificationsVal).map(key => notificationsVal[key]);
    console.log('notifications wwwww=>',notificationsArr);
    var x = notificationsArr.map(x=>x.otherId);
    console.log('otherIds',x);
    console.log('ownerId',this.props.ownerId);
    var getIndex = x.indexOf(this.props.ownerId);
    console.log('getIndex',getIndex,typeof(this.props.ownerId),typeof(x[0]));
    if(getIndex !== -1){
        let notificationId = notificationsArr[getIndex].id;
        let senderId = notificationsArr[getIndex].ownerId;
        //get sender name 
        let senderIndex = this.state.users.findIndex(user=> senderId === user.id );
       if(senderIndex !==-1){
        let senderName = this.state.users[senderIndex].name;
        let chatNotifyId = notificationsArr[getIndex].chatId;
        this.openNotification(notificationId,senderId,senderName,chatNotifyId);
       }
    }else{
        console.log('no notified');
    }

}


close = () => {
    console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
  };
  
 openNotification = (notificationId,senderId,senderName,chatNotifyId) => {
     console.log('notification opend');
    
            let otherUser = _.filter(this.state.users,(user)=> { return (user.id === senderId)});
            console.log('otherUser//////////=>',otherUser[0]);
            const key = `open${Date.now()}`;
            const btn = (
            <Button type="primary" size="small" onClick={this.openChat(otherUser[0])}>
                Open Chat
            </Button>
            );
            notification.open({
            message: `New Message`,
            description: `${senderName} send a message to you`,
            btn,
            key,
            onClose: this.close(),
            });
  };

openChat=(user)=>{
    console.log('open chat for this notification',user);
    // this.userClickedHandler(user)
}

getAllData(values){
    let messagesVal = values;
    let messages = _(messagesVal)
                      .keys()
                      .map(messageKey => {
                          let cloned = _.clone(messagesVal[messageKey]);
                          cloned.key = messageKey;
                          return cloned;
                      })
                      .value();
      this.setState({
        messages: messages
      });
  }

  getAllUsers(values){
      let usersVal = values;
      let users = _(usersVal)
      .keys()
      .map(userKey => {
          let clonedUser = _.clone(usersVal[userKey]);
          return clonedUser; 
      }).value();
      console.log('users:=>',users);
      this.setState({
          users:users
      });

  }


//   checkIfotherIdExits = (otherId) => {
//     // check if the user chat with this other user or not 
//     let exist = false;
//     database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
//         if(snapshot.val() !== null){
//            // chatWithList = snapshot.val();
//            let otherIdIndex = snapshot.val().findIndex(item => item.otherId === otherId);
//            if(otherIdIndex !== -1){
//                    exist = true;
//                    alert('user exist');
//                }else{
//                    exist = false; 
//                    alert('user not exist');
//                }
//         }
//     });
//     return exist;
//  };

getAllUsersThatOwnerChatWithThem = (otherUserId) =>{
    let ownerUsersIdList = null;
    database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
        if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith')){
            ownerUsersIdList = snapshot.val().chatWith.find( item => item.otherId === otherUserId ).otherId;
        }
    });
    alert(ownerUsersIdList);
    return ownerUsersIdList;
}

// getAllUsersThatOtherChatWithThem = (otherUserId)=>{
//     let otherUsersIdList;
//     database.ref('/users/' + otherUserId).on('value',(snapshot)=>{
//         if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith')){
//             otherUsersIdList = snapshot.val().chatWith.find( item => item.otherId === this.props.ownerId ).otherId;
//         }
//     });
//     return otherUsersIdList;
// }


    userReadAllMessages=(userId,chatId)=>{
        let chatWith; 
        database.ref(`/users/${userId}/chatWith/`).on('value',(snapshot)=>{
            chatWith = snapshot.val();
        });
        // let itemIndex = chatWith.findIndex(item => item.chatId === this.props.chatId);

        chatWith.find(item => item.otherId === this.props.ownerId).unread = 0;
        // console.log('chatWith:',chatWith[itemIndex]);
        // if(itemIndex !== -1){
        //     chatWith[itemIndex].unread = 0;
        // }
        database.ref('/users/' + userId).update({
            chatWith:chatWith
        });
    }

userClickedHandler =(user)=>{
    // clean message list
    this.setState({
        messages:[],
        otherId:user.id
    });

    if(this.getAllUsersThatOwnerChatWithThem(user.id) !== null){
        // check if user.id is in list .
        if(this.getAllUsersThatOwnerChatWithThem(user.id).includes(user.id)){
            // then owner chat with this user before 
            
            //get the chat id between them
            let chatIdBetweenUs = null;
            database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
                if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith')){
                    chatIdBetweenUs = snapshot.val().chatWith.find( item => item.otherId === user.id ).chatId;
                }
            });

            // user read all messages
            this.userReadAllMessages(user.id,chatIdBetweenUs);

            // get all messages in the chat
            let app = database.ref(`${chatIdBetweenUs}`);
            app.on('value', snapshot => {
                if(snapshot.val() !== null){
                    this.getAllData(snapshot.val());
                }
            
            });

            this.setState({
                    chatId:chatIdBetweenUs
                });

            
        }else{
            // then owner doesn't chat with this user before
            // create chat id 
            let chatId = database.ref('/').push().key;
            // create notification id 
            let notificationId = database.ref('/notifications/').push().key;


            // update owner chatWith list by adding otherId
            // let ownerUsersChatWithList;
            // database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
            //     if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith') && snapshot.val().chatWith !== null){
            //         ownerUsersChatWithList = snapshot.val().chatWith;
            //     }else {
            //         ownerUsersChatWithList = [];
            //     }
            // });
            // console.log('ownerChatList before update',ownerUsersChatWithList);
            // ownerUsersChatWithList.push({
            //     otherId:user.id,
            //     chatId:chatId,
            //     unread:0
            // });
            // console.log('ownerChatList after update',ownerUsersChatWithList);
            // database.ref('/users/' + this.props.ownerId).update({
            //     chatWith:ownerUsersChatWithList
            // });

            //get all chatWith users
    let chatWith; 
    database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
        chatWith = snapshot.val();
    });

        
    //update owner user by adding users he talking with them
    let nowChatWith={
        otherId:user.id,
        chatId:chatId,
        unread:0
    };

    if(chatWith!==null){
        chatWith.push(nowChatWith);
    }else{
        chatWith=[nowChatWith];
    }
    

    database.ref('/users/'+this.props.ownerId).update({
        chatWith:chatWith
    });
            
            // update other chatWith list by adding ownerId
            // let otherUsersChatWithList;
            // database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
            //     if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith') && snapshot.val().chatWith !== null){
            //         otherUsersChatWithList = snapshot.val().chatWith;
            //     }else{
            //         otherUsersChatWithList = [];
            //     }
            // });
            // console.log('otherChatList before update',otherUsersChatWithList);

            // otherUsersChatWithList.push({
            //     otherId:this.props.ownerId,
            //     chatId:chatId,
            //     unread:0
            // });
            // console.log('otherChatList after update',otherUsersChatWithList);
            // database.ref('/users/' + user.id).update({
            //     chatWith:otherUsersChatWithList
            // });

            let otherChatWith; 
            database.ref(`/users/${user.id}/chatWith/`).on('value',(snapshot)=>{
                otherChatWith = snapshot.val();
            });
                
            //update other user by adding users he talking with them
            let userNeedToChat={
                otherId:this.props.ownerId,
                chatId:chatId,
                unread:0
            };
        
            if(otherChatWith!==null){
                otherChatWith.push(userNeedToChat);
            }else{
                otherChatWith=[userNeedToChat];
            }
        
            database.ref('/users/'+ user.id).update({
                chatWith:otherChatWith
            });

            // send welcome message to otherUser
            let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
            database.ref(`/${chatId}`).push(message).then(()=>{
                console.log('message sent');
            }).catch((err)=>{
                console.log('message failed',err);
            });

            // send notification to other user
            let notification = notificationModel(notificationId,this.props.ownerId,user.id,chatId);
            database.ref('/notifications/'+notificationId).set(notification).then(()=>{
                console.log('success');
            }).catch((err)=>{
                console.log('conversation error :',err);
            });

            // get all messages between owner and other in chat id
            let app = database.ref(`${chatId}`);
            app.on('value', snapshot => {
                if(snapshot.val() !== null){
                    this.getAllData(snapshot.val());
                }
            });

            this.setState({
                    chatId:chatId,
                    notificationId:notificationId
                });
        }
    }else{
        alert('nooooooo');
        // then owner doesn't chat with this user before
            // create chat id 
            let chatId = database.ref('/').push().key;
            // create notification id 
            let notificationId = database.ref('/notifications/').push().key;
            // update owner chatWith list by adding otherId
            // let ownerUsersChatWithList = [] ;

            // ownerUsersChatWithList.push({
            //     otherId:user.id,
            //     chatId:chatId,
            //     unread:0
            // });

            // database.ref('/users/' + this.props.ownerId).update({
            //     chatWith:ownerUsersChatWithList
            // });


            //get all chatWith users
    let chatWith; 
    database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
        chatWith = snapshot.val();
    });

        
    //update owner user by adding users he talking with them
    let nowChatWith={
        otherId:user.id,
        chatId:chatId,
        unread:0
    };

    if(chatWith!==null){
        chatWith.push(nowChatWith);
    }else{
        chatWith=[nowChatWith];
    }
    
    //update owner user by adding users he talking with them
    // let ownerUser = userModel(ownerId,this.props.userImage,ownerName,ownerMail,token,this.props.isOnline,false,this.props.loggedOutAt,chatWith);
    // database.ref('/users/' + ownerId).set(ownerUser).then(()=>{
    //     console.log('owner user updated successfully');
    // }).catch((err)=>{
    //     console.log('user updated failed',err);
    // });

    database.ref('/users/'+this.props.ownerId).update({
        chatWith:chatWith
    });
            
            // update other chatWith list by adding ownerId
            // let otherUsersChatWithList;
            // database.ref('/users/' + this.props.ownerId).on('value',(snapshot)=>{
            //     if(snapshot.val() !== null && snapshot.val().hasOwnProperty('chatWith') && snapshot.val().chatWith !== null){
            //         otherUsersChatWithList = snapshot.val().chatWith;
            //     }else{
            //         otherUsersChatWithList = [];
            //     }
            // });
            // alert('otherChatList before update',otherUsersChatWithList);

            // otherUsersChatWithList.push({
            //     otherId:this.props.ownerId,
            //     chatId:chatId,
            //     unread:0
            // });

            // alert('otherChatList after update',otherUsersChatWithList);
            // database.ref('/users/' + user.id).update({
            //     chatWith:otherUsersChatWithList
            // });

            let otherChatWith; 
            database.ref(`/users/${user.id}/chatWith/`).on('value',(snapshot)=>{
                otherChatWith = snapshot.val();
            });
                
            //update other user by adding users he talking with them
            let userNeedToChat={
                otherId:this.props.ownerId,
                chatId:chatId,
                unread:0
            };
        
            if(otherChatWith!==null){
                otherChatWith.push(userNeedToChat);
            }else{
                otherChatWith=[userNeedToChat];
            }
        
            database.ref('/users/'+ user.id).update({
                chatWith:otherChatWith
            });

            // send welcome message to otherUser
            let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
            database.ref(`/${chatId}`).push(message).then(()=>{
                console.log('message sent');
            }).catch((err)=>{
                console.log('message failed',err);
            });

            // send notification to other user
            let notification = notificationModel(notificationId,this.props.ownerId,user.id,chatId);
            database.ref('/notifications/'+notificationId).set(notification).then(()=>{
                console.log('success');
            }).catch((err)=>{
                console.log('conversation error :',err);
            });

            // get all messages between owner and other in chat id
            let app = database.ref(`${chatId}`);
            app.on('value', snapshot => {
                if(snapshot.val() !== null){
                    this.getAllData(snapshot.val());
                }
            });

            this.setState({
                    chatId:chatId,
                    notificationId:notificationId
                });
    }
}

sendClickedHandler = ()=>{
    let app = database.ref(`${this.state.chatId}`);
        app.on('value', snapshot => {
            if(snapshot.val() !== null){
                this.getAllData(snapshot.val());
            }
        });
};


//  userExistsCallback=(exists)=> {
//     if (exists) {
//       return true;
//     } else {
//       return false;
//     }
//   }


// // Tests to see if /users/<userId> has any data. 
//  checkIfUserExists=()=> {
//     database.ref('/users').child(this.props.ownerId).once('value', (snapshot)=> {
//     var exists = (snapshot.val() !== null);
//     this.userExistsCallback(exists);
//   });
// }

     offlineUser = () => {
            //check if user exists
            let ownerId = this.props.ownerId;
            database.ref('/users').child(ownerId).once('value', (snapshot)=> {    
                if(snapshot.val !==null){
                        //update is online from firebase
                        database.ref('/users/' + ownerId).update({
                            isOnline:false,
                            loggedOutAt:Date.now()
                            });

                            //list all users after changes
                            //child_changed
                            database.ref('/users').on("value",(snapshot)=>{
                                if(snapshot.val() !== null){
                                    this.getAllUsers(snapshot.val());
                                }
                            });
                }
            });
        }

        onlineUser = () => {
              //check if user exists
              let ownerId = this.props.ownerId;
              if(ownerId){
                database.ref('/users').child(ownerId).once('value', (snapshot)=> {    
                    if(snapshot.val !==null){
                            //update is online from firebase
                            database.ref('/users/' + ownerId).update({
                                isOnline:true,
                                loggedOutAt:null
                                });
    
                                //list all users after changes
                                //child_changed
                                database.ref('/users').on("value",(snapshot)=>{
                                    if(snapshot.val() !== null){
                                        this.getAllUsers(snapshot.val());
                                    }
                                });
                    }
                }); 
              }
        }

   
    render(){

     window.onbeforeunload = (e)=> {
        // var dialogText = 'Dialog text here';
        // e.returnValue = dialogText;
        this.offlineUser();
        // return dialogText;
    }

    window.onload=()=>{
        console.log('looooooodedd');
        this.onlineUser();
    }

        

        return(
            <Layout style={{ padding: '15px 0', background: '#fff' }}>
            <UserList users={this.state.users} ownerId={this.props.ownerId}  userClicked={(user)=>this.userClickedHandler(user)}/>
            <Content style={{ padding: '0 24px', minHeight: 280 }} >
             <Content style={{padding: '24px 24px 24px 24px', margin: '0px 0px 10px 0px', minHeight: 285 ,background:'#fff1f0'}}>
                <MessageList messages = {this.state.messages} owner ={this.props.ownerId}/>
             </Content>
             <Footer>
                 <MessageBox db={database} chatId={this.state.chatId} otherId={this.state.otherId} sendClicked={this.sendClickedHandler}/>
             </Footer>
           </Content>
         </Layout>
        );
    }
}

const mapStateToProps = state =>{
    console.log(state);
    return{
        ownerId:state.UserAuth.ownerId,
        userImage:state.UserAuth.userImage,
        ownerName:state.UserAuth.ownerName,
        email:state.UserAuth.email,
        token:state.UserAuth.token,
        isOnline:state.UserAuth.isOnline,
        loggedOutAt:state.UserAuth.loggedOutAt
    };
};
const mapDispatchToProps=dispatch=>{
    return{
        onAuth:(userId,userToken)=>dispatch(actionCreators.onAuth(userId,userToken))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Chat));