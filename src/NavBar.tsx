import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from "react-bootstrap/Dropdown";
import Button from 'react-bootstrap/Button'
import './NavBar.css'

interface NavBarState {
    requestResult: string; // The result of the request to the building names
}

interface NavBarProps {
    updateStart(source: string):void; // Tells parent component about selected start building
    updateEnd(source: string):void; // Tells parent component about selected end building
    getShortestPath(): void; // make fetch request for shortest path
    clearPath(): void; // clear current path and selected buildings
    start: string; // the start building
    end: string; // the end building
}
class NavBar extends Component<NavBarProps, NavBarState> {

    constructor(props: NavBarProps) {
        super(props);
        this.state = {
            requestResult: '{"noRequest": "req"}'
        }
    }


    /** Makes a fetch request to get building names from server
     *
     */
    makeRequest = async () => {
        try {
            let response = await fetch("http://localhost:4567/buildings");
            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return;
            }
            let text = await response.text();
            this.setState({
                requestResult: text
            });

        } catch(e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    }

    componentDidMount() {
        // Make request to get buildings to intialize dropdown selectors
        this.makeRequest();
    }

    /** Tell parent component about updated start building
     *  when selected on dropdown menu
     *
     */
    updateStart = (source: string) => {
        this.props.updateStart(source);
    }

    /** Tell parent component about updated end building
     *  when selected on dropdown menu
     *
     */
    updateEnd = (source: string) => {
        this.props.updateEnd(source);
    }

    /** Tells parent component to make request for shortest path
     *
     *
     */
    getShortestPath = () => {
        // Only tell parent component to make request when start and end
        // have been selected
        if (this.props.start !== "" && this.props.end !== "") {
            this.props.getShortestPath();
        }
    }


    /** Tells parent component to clear the current path
     *
     *
     */
    clearPath = () => {
        this.props.clearPath();
    }

    render() {
        // Parse buildings list into JSON object and get keys (short building names)
        const res = JSON.parse(this.state.requestResult);
        const buildings: Array<string> = Object.keys(res);

        return (
            <div
            style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

                    <div >
                        <Dropdown >
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Start
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                {buildings.map((building, i) => {
                                    return (<Dropdown.Item eventKey={building}
                                    onClick={() => this.updateStart(building)}>{building}</Dropdown.Item>)
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div >
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select End
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {buildings.map((building, i) => {
                                    // Map building names to dropdown item event key and text
                                    return (<Dropdown.Item eventKey={building}
                                    onClick={() => this.updateEnd(building)}>{building}</Dropdown.Item>)
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div >

                        <Button onClick={this.getShortestPath}>
                            Find Path!
                        </Button>
                    </div>

                    <div >

                        <Button onClick={this.clearPath}>
                            Clear Path
                        </Button>

                    </div>

            </div>
        );

    }
}

export default NavBar;
