import React, { Component } from 'react';
import { Layout } from 'antd';
import Chat from "../src/containers/Chat/Chat";
import {Route} from "react-router-dom";
import Login from "../src/containers/Login/Login";
import Home from "../src/components/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import ResetPassword from "./containers/ResetPassword";
import Logout from "./containers/Logout";
import Register from "../src/containers/Register";
import ChatHeader from "../src/components/ChatHeader/ChatHeader";
// import firebaseApp from "./js/firebase";



const {  Content, Footer } = Layout;


class App extends Component {

  

  render() {
    
  //    // make user offline after browser or tab closed
  //    console.log('ownerid from index :',this.props.ownerId);
  //   if(this.props.ownerId){
      
  //   }

  // // window.onbeforeunload = function(e) {
  // //   var dialogText = 'Dialog text here';
  // //   e.returnValue = dialogText;
  // //   return dialogText;
  // // };

    return (
      <div>
        <Layout>
        <ChatHeader>Header</ChatHeader>
           <Content style={{ padding: '50px 50px 20px 50px' }}>
           <Route exact path='/' component={Home}/>
                  <Route  path='/login' component={Login}/>
                  <Route path="/profile" component={UserProfile}/>
                  <Route  path='/chat' component={Chat}/>
                  <Route path='/register' component={Register}/>
                  <Route path="/resetpassword" component={ResetPassword}/>
                  <Route path="/logout" component={Logout}/>
           </Content>
           <Footer style={{ textAlign: 'center' }}>
                 Chat App ©2018 Created by ahme6.azza8
           </Footer>
        </Layout>
        
      </div>
    );
  }
}



export default App;