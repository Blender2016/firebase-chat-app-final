import React, {Component} from "react";
import {Avatar,Card,Icon,Row,Col,Form,Spin,  Input, Button,Divider,message } from "antd";
import {connect} from "react-redux";
import * as actionCreators from "../../store/actions/index";
import {withRouter} from "react-router-dom";
import axios from "../../axios_base";
const { Meta } = Card;

const FormItem = Form.Item;


class UserProfile extends Component{
    state={
        confirmDirty: false,
        imgData:null,
        userName:null,
        show:false,
        disable:true,
        loading:false
    };

    componentWillMount(){

        console.log('before auth',this.props.ownerId,this.props.token);
        axios.get(`/user/${this.props.ownerId}`,{ headers: { 'X-auth':this.props.token } }).then(res=>{
            console.log(res.data);
        }).catch(err=>{
            console.log('err [not authenticated]',err);
            this.props.history.push('/login');
        });

    }

    updateProfileClickedHandler=()=>{
            console.log('Received values of form: ', this.state.userName);
            let name = this.state.userName;
            if(!this.state.userName){
                name=this.props.userName
            }
           //*-------- image -----------*//
            console.log('x',this.state.imgData);
            var fd = new FormData();
            fd.append('imgData',this.state.imgData);
            fd.append('userImage',this.props.userImage);
            fd.append('op','base64');
            fd.append('username',name);
            fd.append('email',this.props.email);
           //*--------------------------*//
            this.props.onProfileUpdate(fd);

            // setTimeout(()=>{
            // if(this.props.isAuth){
            //     this.props.history.push('/login');
            // }
            //  },this.state.time);

    };


    updatePasswordClickedHandler=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              this.setState({
                  loading:true
              });
            console.log('Received values of form: ', values);
            let newPassword = values.newPassword;
            axios.patch('/updatepassword',{
                email:this.props.email,
                password:newPassword
            }).then(res=>{
                console.log('password updated successfully');
                message.success('password updated successfully');
                this.setState({
                    loading:false,
                });
            }).catch(err=>{
                console.log('updated failed');
                message.error('updated failed');
                this.setState({
                    loading:false
                });
            });

          }
        });
    };

    nameChangeHandler=(e)=>{
        let userName = e.target.value;
        if (!userName){
            userName=this.props.UserName
        }
        console.log(userName);
          this.setState({
              userName:userName
          });
          //-------------
          

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



    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }

      checkPasswdValidation=(rule,value, callback)=>{
        // const form = this.props.form;
        if(value){
            axios.post('/passwdconfirm',{
                email:this.props.email,
                password:value
            }).then((res)=>{
                console.log(res.data);
                this.setState({
                    disable:false
                });
                callback();
            }).catch((err)=>{
                console.log(err);
                callback('password is incorrect');
            });
        }
      }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
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
    editClickedHandler=()=>{
        console.log('true'); 
        this.setState({
            show:true
        });
    }
    render(){

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
        var profile;
        if(this.state.show){
             profile = (
    <Card title="Update Profile" bordered={false}>
         <Spin spinning={this.props.loading}>
                <div style={{  marginLeft: '200px',marginBottom:'50px' }}>
                    <Avatar 
                     src = {this.props.userImage} 
                     style={{ verticalAlign: 'middle'  }} alt=''/>
                    <input 
                    type='file' 
                    style={{ marginLeft: 16, verticalAlign: 'middle' }}
                     onChange={this.fileClickedHandler}/>
                    <Input
                     style={{ marginLeft: 16, marginTop:10,verticalAlign: 'middle' }} 
                     defaultValue={this.props.userName} 
                     onChange={this.nameChangeHandler}/>
                    <Button 
                    size="small" 
                    style={{ marginLeft: 16,marginTop:10 ,verticalAlign: 'middle' }} 
                    onClick={this.updateProfileClickedHandler}>
                    Update
                    </Button>
                     </div>
                     </Spin>


                     
                     <Divider>Update Password</Divider>
                     <Spin spinning={this.state.loading}>
                <Form onSubmit={this.updatePasswordClickedHandler} >
               
                <FormItem
                {...formItemLayout}
                label="old Password"
                >
                    {getFieldDecorator('oldPassword', {
                        rules: [{
                        required: true, message: 'Please input your password!',
                        }, {
                        validator: this.checkPasswdValidation,
                        }],
                    })(
                        <Input type="password" />
                    )}
                    </FormItem>

                     <FormItem
                {...formItemLayout}
                label="new Password"
                >
                    {getFieldDecorator('newPassword', {
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
                    label="Confirm New Password"
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
                        loading={this.state.loading}>
                        Update Password
                     </Button>
                    </FormItem>

            </Form>
                       
          </Spin>
                </Card>
            );
        }
        return(

            <div style={{ background: '#ECECEC', padding: '30px' }}>
            <Row gutter={16}>
            <Col span={8}>
            <Card
                style={{ width: 300 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="edit"  onClick={this.editClickedHandler}/>]}
            >
                        <Meta
                        avatar={<Avatar src={this.props.userImage} />}
                        title={this.props.userName}
                        description="This is the description"
                        />
             </Card>
            </Col>
            <Col span={16}>
                {profile}
            </Col>
            </Row>
  </div>
        );
    }
}

const mapStateToProps =state=>{
    return{
        ownerId:state.UserAuth.ownerId,
        token:state.UserAuth.token,
        email:state.UserAuth.email,
        userName:state.UserAuth.ownerName,
        userImage:state.UserAuth.userImage,
        loading:state.UserAuth.loading
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onProfileUpdate:(userData) => dispatch(actionCreators.onProfileUpdate(userData))
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(withRouter(UserProfile)));