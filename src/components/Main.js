import React from "react";
import axios from "axios";
import Loader from "./Loader";
import {isNullOrUndefined} from  "../utils";

export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoaded : false,
            data : null,
            err : null
        };
    }

    // While we display our loader, fetch API data. Also, since the API 
    // provided by EA doesnt send CORS headers with the response, 
    // im proxying my request via the dev server to overcome CORS issues.
    componentDidMount(){
        axios.get("/api/v1/cars", {
            headers : {"Accept" : "text/plain"}
        })
        .then((res) => {

            // create a map whose keys are the make values
            // so that we have no duplicate make entries
            let map = new Map();
            
            // check if show name is present
            for(let showIndex in res.data){
                let show = res.data[showIndex];
                let showName = show.name ? show.name : "undefined show";
                
                //check if make and model names are present
                for(let carIndex in show.cars){
                    let car = show.cars[carIndex];
                    let carMake = car.make ? car.make : "undefined make"
                    let carModel = car.model ? car.model : "undefined model"

                    // create a map whose keys are the model names so we can
                    // easily store the shows a particular model has visited
                    if(map.has(carMake)){
                        let modelMap = map.get(carMake);
                        if(modelMap.has(carModel)){
                            modelMap.get(carModel).add(showName);
                        }
                        else{
                            let shows = new Set();
                            shows.add(showName);
                            modelMap.set(carModel, shows);
                        }
                    }
                    else{
                        let modelMap = new Map();
                        let shows = new Set();
                        shows.add(showName);
                        modelMap.set(carModel, shows);
                        map.set(carMake, modelMap);
                    }
                }
            }
            // sort the map keys (make) alphabetically
            let sortedMap = new Map([...map.entries()].sort());
            this.setState({
                isLoaded : true,
                data : res.data == "" ? "" : sortedMap
            });
        })
        .catch((err) => {
            this.setState({
                isLoaded : true,
                err : err.toString()
            });
        });
    }

    // Display loader while fetching. If we fetch
    // successfully, render the data, otherwise show error.
    render(){
        let div = <Loader/>;
        if(this.state.isLoaded){
            if(isNullOrUndefined(this.state.data)){
                div = (<div className="error">Failed to fetch data: {this.state.err}</div>);
            }
            else if(this.state.data == ""){
                div = (<div className="error">Empty dataset recieved</div>);
            } 
            else{
                let keys = Array.from(this.state.data.keys());
                let values = Array.from(this.state.data.values());
                div = <div id="main">{
                    keys.map((make, index) => {
                        let keys2 = Array.from(values[index].keys());
                        let values2 = Array.from(values[index].values());
                        return(<div key={index}>{make}{
                        keys2.map((model, index2) => {
                            let shows = Array.from(values2[index2]).toString();
                            return <div key={index2}>{model + ": " + shows}<br/></div>
                        })
                    }<br/></div>)
                    })}
                </div>
            }
        } 
        return div;
    }
}