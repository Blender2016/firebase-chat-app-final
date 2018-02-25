import React, {Component} from "react";
import {connect} from "react-redux";
// import axios from "axios";
import * as actionCreators from "../store/actions/index";
import { Form,Spin, Icon, Input, Button,Tooltip ,Avatar } from 'antd';
import {withRouter, Link} from "react-router-dom";
const FormItem = Form.Item;


class Register extends Component{

    state = {
        confirmDirty: false,
        imgData:null,
        time:3000
      };

      componentWillReceiveProps(nextProps){
        if(nextProps.time !== this.props.time){
            this.setState({
                time:this.props.time
            });
        }
      }
  
    submitClickedHandler=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            console.log('upload',values.upload);
            let first = values.firstName;
            let last = values.lastName;
            delete values['firstName'];
            delete values['lastName'];
            delete values['confirm'];
            values['name']={
                first:first,
                last:last
            }


    
           values['isOnline']=true;

           //*-------- image -----------*//
            console.log('x',this.state.imgData);
            var fd = new FormData();
            fd.append('imgData',this.state.imgData);
            fd.append('op','base64');
            fd.append('first',values.name.first);
            fd.append('last',values.name.last);
            fd.append('username',values.username);
            fd.append('email',values.email);
            fd.append('password',values.password);
            fd.append('isOnline',true);
           //*--------------------------*//
            this.props.onRegister(fd);
            setTimeout(()=>{
            if(this.props.isAuth){
                this.props.history.push('/chat');
            }
             },this.state.time);

          }
        });
    };

    // checkLocalStorage=()=>{
    //         var allData =localStorage.getItem('persist:root');
    //         var allDataToJson = JSON.parse(allData);
    //         var userData = JSON.parse(allDataToJson.UserAuth)
    //         var userToken = userData.token;
    //         if(userToken){
    //             this.props.history.push('/chat');
              
    //         }
    // }

  


      handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
      }

      checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
      
      fileClickedHandler=(e)=>{
          console.log(e.target.files[0]);
        //   this.setState({
        //       image:e.target.files[0]
        //   });
          //-------------
          var image = e.target.files[0];
          var reader  = new FileReader();
          
              reader.addEventListener("load", ()=> {
                this.setState({
                imgData:reader.result
                });
                console.log('image:' , this.state.imgData);
              }, false);
            
              if (image) {
                reader.readAsDataURL(image)
              }
        
      }

    //    encodeImageFileAsURL=()=> {
    //           var reader  = new FileReader();
    //           reader.addEventListener("load", function () {
    //             console.log( 'result',reader.result);
    //           }, false);
            
    //           if (this.state.image) {
    //             console.log('dataurl',reader.readAsDataURL(this.state.image));
    //           }
    //   }

    //   uploadClickedHandler=()=>{
    //       console.log('x',this.state.imgData);
    //       var fd = new FormData();
    //       fd.append('imgData',this.state.imgData);
    //       fd.append('op','base64');
    //       for (var pair of fd.entries()) {
    //         console.log(pair[0],' ->', pair[1]); 
    //     }
    //     //   console.log('formdata:', fd.get()); 
    //       console.log('image:', this.state.image);
    //       axios.post('http://localhost:3000/api/fileupload/create',fd).then(res=>{
    //           console.log(res);
    //       });
    //   }

   

    

    //   onPageReloaded=()=>{
    //       console.log('page reloaded');
    //   }

    render(){
        // window.onload = this.onPageReloaded;
        
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };

          const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };

        return(
            <Spin spinning={this.props.loading}>
                {/* <Button onClick={this.encodeImageFileAsURL}>Upload</Button> */}
                <div style={{  marginLeft: '300px',marginBottom:'50px' }}>
                    <Avatar  src = {this.state.imgData} style={{ verticalAlign: 'middle'  }} alt=''/>
                    <input type='file' style={{ marginLeft: 16, verticalAlign: 'middle' }} onChange={this.fileClickedHandler}/>
                    {/* <Button size="small" style={{ marginLeft: 16, verticalAlign: 'middle' }} onClick={this.uploadClickedHandler}>
                    Upload
                    </Button> */}
                     </div>
                <Form onSubmit={this.submitClickedHandler} >
                <FormItem
                    {...formItemLayout}
                    label='First Name'
                    >
                    {getFieldDecorator('firstName', {
                        rules: [{ required: true, message: 'Please input your first name!' }],
                    })(
                        <Input />
                    )}
                 </FormItem>
                 <FormItem
                    {...formItemLayout}
                    label='Last Name'
                    >
                    {getFieldDecorator('lastName', {
                        rules: [{ required: true, message: 'Please input your last name!' }],
                    })(
                        <Input />
                    )}
                 </FormItem>
                 <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        UserName&nbsp;
                        <Tooltip title="What do you want others to call you?">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                        </span>
                    )}
                    >
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="E-mail"
                    >
                    {getFieldDecorator('email', {
                        rules: [{
                        type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                        required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                {...formItemLayout}
                label="Password"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                        required: true, message: 'Please input your password!',
                        }, {
                        validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password" />
                    )}
                    </FormItem>

                    <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                            required: true, message: 'Please confirm your password!',
                            }, {
                            validator: this.checkPassword,
                            }],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                     <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={this.props.loading}>
                        Register
                     </Button>
                        Or <Link to='/login'>Login now!</Link>
                    </FormItem>

            </Form>
                       
          </Spin>
        );
    }
}

const mapStateToProps = state =>{
    console.log(state);
    return{
        loading:state.UserAuth.loading,
        isAuth:state.UserAuth.isAuth
    }
};
const mapDispatchToProps = dispatch =>{
    return{
        onRegister:(userData) => dispatch(actionCreators.onRegister(userData))
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Form.create()(Register)));