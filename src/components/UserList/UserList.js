import React, {Component} from "react";
import { Layout,  List, Avatar ,Badge} from 'antd';
import _ from "lodash";
// import moment from "moment";
import styles from "./UserList.module.css";

// import uuidv4 from "uuid/v4";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.locale(en);
const timeAgo = new TimeAgo('en-US');

const {Sider } = Layout;

class UserList extends Component{

    // src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"

    state={
        index:null
    }

    // componentWillMount(){
    //     this.getMessagesCount(user);
    // }

    // getMessagesCount=(user)=>{
    //    if(user.chatWith){
    //      return user.chatWith.findIndex(item => item.otherId === this.props.ownerId);
    //    }else{
    //        return 0;
    //    }
    // }

    unreadMessages = (chatWithList) =>{
        console.log('chatWithList :===>',chatWithList);
        let count;
        if(chatWithList){
            let index = chatWithList.findIndex(item => item.otherId === this.props.ownerId);
            console.log('unread INdex:==>',index);
            if(index !== -1){
                count = chatWithList[index].unread;
            }else{
                count =0;
            }
        }else{
            count = 0;
        }
        return count;
    }

    
    render(){
        
        var usersList = _.filter(this.props.users,(user)=> { return (user.id !== this.props.ownerId)});
        //   console.log('allUsersWithoutCurrentUser:',allUsersWithoutCurrentUser);
        //   var usersList = allUsersWithoutCurrentUser.map(user => user );
          console.log('usersList',usersList);
        //   var indexList = usersList.map(user=>{
        //      return  user.chatWith.findIndex(item => item.otherId === this.props.ownerId);
        //   });
        // var mark;
        // if(this.props.active){
        //     mark=styles.Selected
        // }else{
        //     mark=null
        // }
          
        return(
            <Sider width={230} style={{ background: '#fff' }} className={styles.Scrollbar}>
                <List
                    itemLayout="horizontal"
                    dataSource={usersList}
                    renderItem={user => (
                    <List.Item >
                        <List.Item.Meta
                        avatar={<Badge 
                        // count={ user.chatWith ? user.chatWith[user.chatWith.findIndex(item => item.otherId === this.props.ownerId)].unread : 0 }
                        count={this.unreadMessages(user.chatWith)}
                        > 
                        <Avatar src={user.imageUrl} /></Badge> }
                        title={<span 
                            onClick={()=>this.props.userClicked(user)} 
                             >
                                {user.name}
                            {user.isOnline ? <Badge status="processing"  style={{ marginLeft:'10px'}} />
                                             : <Badge status="default" text = {timeAgo.format( user.loggedOutAt)}
                                                style={{ marginLeft:'10px' }} /> }
                         </span>}
                        description={user.isTyping ? "typing ..." : " status"}
                        />
                        {/* <div>{!(user.isOnline) ? timeAgo.format( user.loggedOutAt , 'twitter') : null }</div> 
                    text={timeAgo.format( user.loggedOutAt , 'twitter') }
                    */}
                    </List.Item>
                    )}
                />
          </Sider>
        );
    }
};

export default UserList;