import React, {Component} from "react";
import { Form,Spin, Icon, Input, Button, Checkbox } from 'antd';
import ForgetPassword from "../ForgetPassword/ForgerPassword";
import {connect} from "react-redux";
import {withRouter,Link} from "react-router-dom";
import Styles from "./Login.module.css";
import * as actionCreators from "../../store/actions/index";
const FormItem = Form.Item;
class Login extends Component {
  state={
    visible:false,
    time:2000
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.time !== this.props.time){
        this.setState({
            time:this.props.time
        });
    }
  }



  showModal = () => {
    console.log('clicked');
    this.setState({ visible: true });
    console.log(this.state.visible);
  }


  loginClickedHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        delete values['remember'];
        values['isOnline']=true;
        console.log('values ----->',values);
        this.props.onLogin(values);
        
        setTimeout(()=>{
          if(this.props.isAuth){
              this.props.history.push('/chat');
          }
      },this.state.time);
      }
    });
  }

// checkLocalStorage=()=>{
//     var allData =localStorage.getItem('persist:root');
//     var allDataToJson = JSON.parse(allData);
//     var userData = JSON.parse(allDataToJson.UserAuth)
//     var userToken = userData.token;
//     if(userToken){
//            this.props.history.push('/chat'); 
//     }
// }

  render() {
    
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
         <Spin spinning={this.props.loading}>
        <Form onSubmit={this.loginClickedHandler} className={Styles.loginForm}>
        <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{
                        type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                        required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail" />
                    )}
                </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <span className={Styles.loginFormForgot} onClick={this.showModal}>Forgot password</span>
          <Button type="primary" htmlType="submit" className={Styles.loginFormButton} loading={this.props.loading}>
            Log in
          </Button>
          Or <Link to='/register'>register now!</Link>
        </FormItem>
      </Form>
      </Spin>
      <ForgetPassword visible={this.state.visible}/>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  console.log(state);
  return{
      loading:state.UserAuth.loading,
      isAuth:state.UserAuth.isAuth,
      time:state.UserAuth.time
  }
};
const mapDispatchToProps = dispatch =>{
  return{
      onLogin:(userCredentials) => dispatch(actionCreators.onLogin(userCredentials))
  };
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Form.create()(Login)));