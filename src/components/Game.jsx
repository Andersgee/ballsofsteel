import React, { createRef } from "react";
import socketIOClient from "socket.io-client";
import { Button, Box, Grid } from "@material-ui/core";
import Andygame from "./andygame-gl";
import Contoller from "./controller";

import Settings from "./Settings";
import metaltex from "../assets/images/metal.jpg";
import metalspecular from "../assets/images/metalspecular.jpg";
import metalnormal from "../assets/images/metalnormal.jpg";

const texturefilenames = [metaltex, metalspecular, metalnormal];

const serveradress = "http://127.0.0.1:3000";
//const serveradress = "https://peaceful-reaches-33671.herokuapp.com"

async function fetchglsl() {
  //fetch from static folder for dev pruposes
  return await Promise.all([
    fetch("common2.glsl").then((res) => res.text()),
    fetch("game2.glsl").then((res) => res.text()),
  ]);
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.canvasref = createRef();
    this.socket = socketIOClient(serveradress);
    this.gamestate = {};

    this.state = {};
  }

  reloadglsl = () => {
    fetchglsl().then((glsl) => {
      this.game = new Andygame(this.canvas, glsl[0], glsl[1], texturefilenames);
    });
  };

  componentDidMount() {
    this.canvas = this.canvasref.current;
    this.controller = new Contoller(this.props.keybindings, this.socket);
    fetchglsl().then((glsl) => {
      this.game = new Andygame(this.canvas, glsl[0], glsl[1], texturefilenames);
      this.socket.on("tick", (data) => {
        this.game.updategamestate(data);
      });
      this.socket.emit("setname", this.props.playername);
    });
    /*
    this.game = new Andygame(
      this.canvas,
      this.props.glsl.common,
      this.props.glsl.game
    );

    this.socket.on("tick", (data) => {
      this.gamestate = data;
    });
    this.socket.emit("setname", this.props.playername);
    */
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    return (
      <Box my={0} height="100vh" width="100vv">
        <canvas style={{ position: "fixed" }} ref={this.canvasref} />
        <Grid container justify="space-between">
          <Grid item>
            <Settings
              keybindings={this.props.keybindings}
              setKeybindings={this.props.setKeybindings}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.reloadglsl}
            >
              RELOAD GLSL
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.props.disconnect}
            >
              LEAVE
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
