import React, {Component} from "react";
import { Layout,  List, Avatar } from 'antd';
import _ from "lodash";
import moment from "moment";
import styles from "./UserList.module.css";

// import uuidv4 from "uuid/v4";

const {Sider } = Layout;

class UserList extends Component{

    // src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    render(){
        var allUsersWithoutCurrentUser = _.filter(this.props.users,(user)=> { return (user.id !== this.props.ownerId)});
          console.log('allUsersWithoutCurrentUser:',allUsersWithoutCurrentUser);
          var usersList = allUsersWithoutCurrentUser.map(user => user );
          console.log(usersList);
          
        return(
            <Sider width={200} style={{ background: '#fff' }} className={styles.Scrollbar}>
                <List
                    itemLayout="horizontal"
                    dataSource={usersList}
                    renderItem={user => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src={user.imageUrl} />}
                        title={<span onClick={()=>this.props.userClicked(user)}>{user.name}</span>}
                        description={user.isOnline ? "Online" : `active ${moment(user.loggedAt).fromNow()}`}
                        />
                    </List.Item>
                    )}
                />
          </Sider>
        );
    }
};

export default UserList;











/*
      render(){
        let allUsersWithoutCurrentUser = _.filter(this.props.users,(user)=> { return (user.id !== this.props.ownerId)});
          console.log('allUsersWithoutCurrentUser:',allUsersWithoutCurrentUser);
          let usersList = allUsersWithoutCurrentUser.map(user => {
              return(
                <Menu.Item key={uuidv4()} ><span  onClick={()=>this.props.userClicked(user)}>{user.name}</span></Menu.Item>
              );
          });
        return(
            <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
                {usersList}
            </Menu>
          </Sider>
        );
    }
*/