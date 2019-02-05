import React from "react";

export default class Error extends React.Component{
    constructor(props){
        super(props);
        this.state = {visible : "visible"};
    }

    closeError(){
        this.setState({visible : "hide"});
    }

    render(){
        return(
            <div className={"error drop-shadow " + this.state.visible} onClick={() => this.closeError()}>
                Failed to fetch data:{" " + this.props.msg}
            </div>
        );
    }
}