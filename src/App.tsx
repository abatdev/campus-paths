/*
 * Copyright (C) 2021 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2021 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import React, {Component} from 'react';
import MapView from './MapView';
import NavBar from './NavBar'
import './App.css'

interface AppState {
    startBuilding: string; // the start building to find shortest path for
    endBuilding: string; // the end building to find shortest path for
    shortestpath: string; // the shortest path between end and start
}

class App extends Component<{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            startBuilding: "",
            endBuilding: "",
            shortestpath: ""
        };
    }

    /** Sets start building state when received from child component
     *
     */
    updateStart = (start: string) => {
        this.setState({
            startBuilding: start
        })

    }

    /** Sets end building state when received from child component
     *
     */
    updateEnd = (end: string) => {
        this.setState({
            endBuilding: end
        })

    }

     /** Makes request to server for shortest path between start and end building
      *
      */
     makeRequest = async () => {
        try {
            // Build query string to make request for shortest path between selected start and end building
            let queryString = "?" + "start=" + this.state.startBuilding + "&end=" + this.state.endBuilding;
            let response = await fetch("http://localhost:4567/shortestpath" + queryString);

            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return;
            }
            let text = await response.text();

            this.setState({
                shortestpath: text
            });

        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
     }

    /** Clears state to reset path
      *
      */
    clearPath = () => {
        this.setState({
            startBuilding: "",
            endBuilding: "",
            shortestpath: ""
        })
    }

    render() {
        return (
            <div className="container">

                <div className="centered">
                    <h1>Welcome to Campus Paths!</h1>
                    <p>To get started, select a start building and end building.</p>

                    <div style ={{paddingTop: "20px"}}>
                        <NavBar updateStart={this.updateStart} updateEnd={this.updateEnd}
                        start={this.state.startBuilding} end={this.state.endBuilding}
                        getShortestPath={this.makeRequest} clearPath={this.clearPath}/>
                    </div>

                    <div style={{paddingTop: "40px"}}>
                        <MapView shortestpath={this.state.shortestpath}/>
                    </div>
                </div>


                <div style={{paddingLeft: "20px", paddingTop: "30px"}}>
                    <p>Start of path: {this.state.startBuilding}</p>
                    <p>End of path: {this.state.endBuilding}</p>
                </div>

            </div>
        );
    }

}

export default App;
