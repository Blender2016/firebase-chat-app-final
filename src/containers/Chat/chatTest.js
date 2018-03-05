if(this.otherIdExits(otherId) === false ) {
    var chatId = database.ref('/').push().key;//open new collection between current user and the other user
    var notificationId = database.ref('/notifications/').push().key;

    //get all chatWith users
    let chatWith; 
    database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
        chatWith = snapshot.val();
    });

        
    //update owner user by adding users he talking with them
    let nowChatWith={
        otherId:otherId,
        chatId:chatId,
        unread:1
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

    database.ref('/users/'+ownerId).update({
        chatWith:chatWith
    });

    //update other user by adding users want to talk with him
    //get all otherChatWith users
    let otherChatWith; 
    database.ref(`/users/${user.id}/chatWith/`).on('value',(snapshot)=>{
        otherChatWith = snapshot.val();
    });
        
    //update other user by adding users he talking with them
    let userNeedToChat={
        otherId:ownerId,
        chatId:chatId,
        unread:1
    };

    if(otherChatWith!==null){
        otherChatWith.push(userNeedToChat);
    }else{
        otherChatWith=[userNeedToChat];
    }

    // let offline;
    // if(user.loggedOutAt){
    //     offline=user.loggedOutAt;
    // }else{
    //     offline=null;
    // }
    // let otherUser = userModel(user.id,user.imageUrl,user.name,user.email,user.token,user.isOnline,false,offline,otherChatWith);
    // database.ref('/users/' + user.id).set(otherUser).then(()=>{
    //     console.log('owner user updated successfully');
    // }).catch((err)=>{
    //     console.log('user updated failed',err);
    // });

    database.ref('/users/'+ user.id).update({
        chatWith:otherChatWith
    });


    
    //add notification into the queue waiting for other user to response 
    var notification = notificationModel(notificationId,ownerId,otherId,chatId);
    database.ref('/notifications/'+notificationId).set(notification).then(()=>{
        console.log('success');
    }).catch((err)=>{
        console.log('conversation error :',err);
    });

    //send welcome message to other user
    let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
    database.ref(`/${chatId}`).push(message).then(()=>{
        console.log('message sent');
    }).catch((err)=>{
        console.log('message failed',err);
    });



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

}else if(this.otherIdExits(otherId) === true){
//when select a user he chat with him before

//get the id of the chat created between them before
let chatIdBetweenUs;
database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
    if(snapshot.val()){
        let otherIdIndex = snapshot.val().findIndex(item => item.otherId === otherId);
        chatIdBetweenUs = snapshot.val()[otherIdIndex].chatId;
    }else{
        chatIdBetweenUs = this.state.chatId
    }
});


//get all chatWith
let chatWith; 
database.ref(`/users/${user.id}/chatWith/`).on('value',(snapshot)=>{
    chatWith = snapshot.val();
});
if(chatWith){
                // 0  1  2  3  4  => index
// chatWith = [{},{},{},{},{}];
let itemIndex = chatWith.findIndex(item => item.chatId === chatIdBetweenUs );
chatWith[itemIndex].unread = 1; 
//reset unread messages to 0
database.ref('/users/' + user.id).update({
   chatWith:chatWith
});

// list all messages between us
let app = database.ref(`${chatIdBetweenUs}`);
app.on('value', snapshot => {
    if(snapshot.val() !== null){
        this.getAllData(snapshot.val());
    }
});
this.setState({
    chatId:chatIdBetweenUs
});
}

}

//--------******************-----------------********************------------------*******************-------------
userClickedHandler=(user)=>{
    this.setState({
        messages:[],
        otherId:user.id
    });
    //get owner user id
    var ownerId = this.props.ownerId;
    //get other user id 
    var otherId = user.id;

    database.ref('/users/'+this.props.ownerId).on('value',(snapshot)=>{
        if(snapshot.val().hasOwnProperty('chatWith') ){
            console.log('owner has chatWith');
            if(snapshot.val().chatWith.findIndex(item => item.otherId === otherId) === -1 ){
                // if not founded then add him to chatWith
                let ownerChatWithList = snapshot.val().chatWith;
                let chatId = database.ref('/').push().key;
                let updatedOwnerChatWithItem = {
                    otherId:otherId,
                    chatId:chatId,
                    unread:0
                };
                ownerChatWithList.push(updatedOwnerChatWithItem);
                database.ref('/users/'+ownerId).update({
                    chatWith:ownerChatWithList
                });

                //update other user chatWith
                database.ref('/users/' + otherId ).on('value',(snapshot)=>{
                    if(snapshot.val().hasOwnProperty('chatWith') ){
                        console.log('other has chatWith');
                        if(snapshot.val().chatWith.findIndex(item => item.otherId === ownerId) === -1 ){
                                 let otherChatWithList = snapshot.val().chatWith;
                                 let updatedOtherChatWithItem = {
                                    otherId:ownerId,
                                    chatId:chatId,
                                    unread:0
                                };
                                otherChatWithList.push(updatedOtherChatWithItem);
                                database.ref('/users/'+otherId).update({
                                    chatWith:otherChatWithList
                                });
                        }else{
                                //other
                        }
                    }else{
                        let otherChatWithList = [];
                        let otherChatWithItem = {
                            otherId:ownerId,
                            chatId:chatId,
                            unread:0
                        };
                        otherChatWithList.push(otherChatWithItem);
                        database.ref('/users/'+otherId).update({
                            chatWith:otherChatWithList
                        });
                    }
                });

                //add notification into the queue waiting for other user to response 
                let notificationId = database.ref('/notifications/').push().key;
                let notification = notificationModel(notificationId,ownerId,otherId,chatId);
                database.ref('/notifications/'+notificationId).set(notification).then(()=>{
                    console.log('success');
                }).catch((err)=>{
                    console.log('conversation error :',err);
                });

                //send welcome message to other user
                let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
                database.ref(`/${chatId}`).push(message).then(()=>{
                    console.log('message sent');
                }).catch((err)=>{
                    console.log('message failed',err);
                });

                 // list all messages between us
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


            }else{
                // if owner chat with this user before then open the previous chat and continue
                //get the id of the chat created between them before
                database.ref(`/users/${this.props.ownerId}/chatWith/`).on('value',(snapshot)=>{
                    if(snapshot.val()){
                        let index = snapshot.val().findIndex(item => item.otherId === user.id);
                        let chatIdBetweenUs = snapshot.val()[index].chatId;
                        // list all messages between us
                        let app = database.ref(`${chatIdBetweenUs}`);
                        app.on('value', snapshot => {
                            if(snapshot.val() !== null){
                                this.getAllData(snapshot.val());
                            }
                        });

                        this.setState({
                            chatId:chatIdBetweenUs
                        });
                    }
                });
            }
        }else{
            console.log('owner hasn\'t chatWith');
            let ownerChatWithList = [];
            let chatId = database.ref('/').push().key;
            let OwnerChatWithItem = {
                otherId:otherId,
                chatId:chatId,
                unread:0
            };
            ownerChatWithList.push(OwnerChatWithItem);
            database.ref('/users/'+ownerId).update({
                chatWith:ownerChatWithList
            });

            //add notification into the queue waiting for other user to response 
            let notificationId = database.ref('/notifications/').push().key;
            let notification = notificationModel(notificationId,ownerId,otherId,chatId);
            database.ref('/notifications/'+notificationId).set(notification).then(()=>{
                console.log('success');
            }).catch((err)=>{
                console.log('conversation error :',err);
            });

            //send welcome message to other user
            let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
            database.ref(`/${chatId}`).push(message).then(()=>{
                console.log('message sent');
            }).catch((err)=>{
                console.log('message failed',err);
            });

             // list all messages between us
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
    });



};
///////////////////////////------------------------------------////////////////
// let chatId = database.ref('/').push().key;
// let OwnerChatWithItem = {
//     otherId:otherId,
//     chatId:chatId,
//     unread:0
// };
// ownerChatWithList.push(OwnerChatWithItem);
// database.ref('/users/'+ownerId).update({
//     chatWith:ownerChatWithList
// });


// //update other user chatWith
// let otherUserChatWithList ;
// database.ref('/users/' + otherId ).on('value',(snapshot)=>{
//    if(snapshot.val().hasOwnProperty('withChat')){
//          otherUserChatWithList = snapshot.val().chatWith;
//    }else{
//        otherUserChatWithList=[];
//    }
// });

// let otherUserChatWithItem = {
//     otherId:ownerId,
//     chatId:chatId,
//     unread:0
// };
// otherUserChatWithList.push(otherUserChatWithItem);
// database.ref('/users/'+otherId).update({
//     chatWith:otherChatWithList
// });

// //add notification into the queue waiting for other user to response 
// let notificationId = database.ref('/notifications/').push().key;
// let notification = notificationModel(notificationId,ownerId,otherId,chatId);
// database.ref('/notifications/'+notificationId).set(notification).then(()=>{
//     console.log('success');
// }).catch((err)=>{
//     console.log('conversation error :',err);
// });

// //send welcome message to other user
// let message = messageModel(this.props.ownerId,`Hello, ${user.name}`);
// database.ref(`/${chatId}`).push(message).then(()=>{
//     console.log('message sent');
// }).catch((err)=>{
//     console.log('message failed',err);
// });

//  // list all messages between us
//  let app = database.ref(`${chatId}`);
//  app.on('value', snapshot => {
//      if(snapshot.val() !== null){
//          this.getAllData(snapshot.val());
//      }
//  });

//  this.setState({
//      chatId:chatId,
//      notificationId:notificationId
//  });

// }