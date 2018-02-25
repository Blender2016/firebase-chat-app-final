export default (id,imageUrl,name,email,token,isOnline,loggedOutAt,chatWith) => ({
    id: id,
    imageUrl:imageUrl,
    name: name,
    email:email,
    token:token,
    isOnline:isOnline,
    loggedOutAt:loggedOutAt,
    chatWith: chatWith         //[{other:name,chat_id:id}]
  })