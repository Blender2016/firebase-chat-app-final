import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as actionCreators from "../store/actions/index";

class Logout extends Component{


    componentWillMount(){
        console.log('token',this.props.token);
         this.props.onLogout(this.props.token,this.props.ownerId);
         localStorage.clear();
         console.log('local storage cleared done');
         this.props.history.push('/login');
    }

    render(){
        return(
            <div>
                user logedout
            </div>
        );
    }
}

const mapStateToProps=state=>{
    return{
        token:state.UserAuth.token,
        ownerId:state.UserAuth.ownerId
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        onLogout:(token,id)=>dispatch(actionCreators.onLogout(token,id))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Logout));