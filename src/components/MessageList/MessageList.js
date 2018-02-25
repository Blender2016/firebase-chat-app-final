import React, {Component} from "react";
import { List } from 'antd';
// import _ from "lodash";
import Message from "../Message/Message";
import styles from "./MessageList.module.css";

// import uuidv4 from "uuid/v4";


class MessageList extends Component{
    
    render(){
        var messageNodes = this.props.messages.map((message) => message );
        console.log(messageNodes);
        return(
                <List
                    itemLayout="horizontal"
                    className={styles.Scrollbar}
                    dataSource={messageNodes}
                    renderItem={message => (
                    <List.Item>
                        <List.Item.Meta
                        // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<Message message={message.message} sender={message.senderId} owner={this.props.owner}/>}
                        />
                    </List.Item>
                    )}
                />
        );
    }
};

export default MessageList;

