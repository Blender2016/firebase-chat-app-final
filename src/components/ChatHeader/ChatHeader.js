import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Layout, Menu} from "antd";
import Styles from "./ChatHeader.module.css";
import {connect} from "react-redux";
const {Header} = Layout;

class ChatHeader extends Component{

    render(){
        var currentHeader=(
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/register" >Register</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/login" >Login</Link></Menu.Item>
            </Menu>
        );
        if(this.props.isAuth){
            currentHeader=(
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/chat">Chat</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/profile" >User Profile</Link></Menu.Item>
                    <Menu.Item key="4"><Link to="/logout" >logout</Link></Menu.Item>
                    
                </Menu>
            );    
        }else{
            currentHeader=(
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/register" >Register</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/login" >Login</Link></Menu.Item>
                </Menu>
            )
        }

        return(
            <Header className="header">
                <div className={Styles.logo} />
                {currentHeader}
            </Header>
    );
    }
};

/*
<Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/chat">Chat</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/register" >Register</Link></Menu.Item>
                    <Menu.Item key="4"><Link to="/login" >Login</Link></Menu.Item>
                    <Menu.Item key="5"><Link to="/logout" >logout</Link></Menu.Item>

                </Menu>
*/

const mapStateToProps=state=>{
    return{
        isAuth:state.UserAuth.isAuth,
    }
}


export default connect(mapStateToProps)(ChatHeader);