import React, {Component} from 'react';
import "./MapView.css";
import 'bootstrap/dist/css/bootstrap.min.css';

interface MapViewState {
    backgroundImage: HTMLImageElement | null;
}

interface MapViewProps {
    shortestpath: string; // The shortest path fetched from the server
}

class MapView extends Component<MapViewProps, MapViewState> {

    // NOTE:
    // This component is a suggestion for you to use, if you would like to.
    // It has some skeleton code that helps set up some of the more difficult parts
    // of getting <canvas> elements to display nicely with large images.
    //
    // If you don't want to use this component, you're free to delete it.

    canvas: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapViewProps) {
        super(props);
        this.state = {
            backgroundImage: null,
        };
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.fetchAndSaveImage();
        this.drawBackgroundImage();
        this.drawPath();
    }

    componentDidUpdate() {
        this.drawBackgroundImage();
        this.drawPath();
    }

    fetchAndSaveImage() {
        // Creates an Image object, and sets a callback function
        // for when the image is done loading (it might take a while).
        let background: HTMLImageElement = new Image();
        background.onload = () => {
            this.setState({
                backgroundImage: background
            });
        };
        // Once our callback is set up, we tell the image what file it should
        // load from. This also triggers the loading process.
        background.src = "./campus_map.jpg";
    }

    drawBackgroundImage() {
        let canvas = this.canvas.current;
        if (canvas === null) throw Error("Unable to draw, no canvas ref.");
        let ctx = canvas.getContext("2d");
        if (ctx === null) throw Error("Unable to draw, no valid graphics context.");

        if (this.state.backgroundImage !== null) { // This means the image has been loaded.
            // Sets the internal "drawing space" of the canvas to have the correct size.
            // This helps the canvas not be blurry.
            canvas.width = this.state.backgroundImage.width;
            canvas.height = this.state.backgroundImage.height;
            ctx.drawImage(this.state.backgroundImage, 0, 0);
        }
    }


    /** Draws the shortest path between two buildings on the map
     *  Only draws path if shortest path has been fetched
     *  If user selects an invalid path, an alert is given
     */
    drawPath = () => {
        let canvas = this.canvas.current;
        if (canvas === null) throw Error("Unable to draw, no canvas ref.");
        let ctx = canvas.getContext("2d");
        if (ctx === null) throw Error("Unable to draw, no valid graphics context.");

        // Only draw path once shortest path has been fetched
        if (this.props.shortestpath !== "") {

            // Convert string representing shortest path to JSON object
            var result = JSON.parse(this.props.shortestpath);

            // There are no paths to and from the same building
            // Alert user no path exists if shortest path is none
            if (result == null) {
                alert('No path found. Select different buildings');
            } else {

                // Path property gives coordinates of points
                var path = result.path;

                // Configure settings for line and text
                ctx.beginPath();
                ctx.strokeStyle = "purple";
                ctx.lineWidth = 15;
                ctx.font = "90px Arial";
                ctx.fillStyle = "white";

                // Label start and end on map
                ctx.fillRect(path[0].start.x-10, path[0].start.y-80, 220, 100)
                ctx.fillRect(path[path.length-1].end.x-10,
                path[path.length-1].end.y-80, 220, 100)
                ctx.fillStyle ="purple"
                ctx.fillText("Start", path[0].start.x, path[0].start.y);

                // Traverse through points of path and draw on map
                for (let i = 0; i < path.length; i++) {
                    var currPath = path[i];
                    var startX = currPath.start.x;
                    var startY = currPath.start.y;
                    var endX = currPath.end.x;
                    var endY = currPath.end.y;

                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }

                ctx.fillText("End", path[path.length-1].end.x, path[path.length-1].end.y);
            }
        }
    }


    render() {
        return (
            <div>
                <canvas ref={this.canvas}/>
            </div>
        )
    }
}

export default MapView;
