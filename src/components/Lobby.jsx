import React, { useState } from "react";
import {
  Button,
  Container,
  Box,
  Grid,
  Typography,
  TextField,
} from "@material-ui/core";
import ControlBindings from "./ControlBindings";

export default function Lobby(props) {
  const [name, setName] = useState("");

  const hasname = name.length > 0;

  const handleTextField = (e) => {
    setName(e.target.value);
    props.setPlayername(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && hasname) {
      props.connect();
    }
  };

  return (
    <Container>
      <Box my={3}>
        <Grid container align="center" justify="center" spacing={3}>
          <Grid item xs={12}>
            <Typography>You are in the lobby</Typography>
          </Grid>
          <Grid item>
            <TextField
              value={name}
              label="Player Name"
              onChange={handleTextField}
              onKeyDown={handleEnter}
            />

            {hasname ? (
              <Button
                onClick={props.connect}
                variant="contained"
                color="primary"
              >
                Join
              </Button>
            ) : (
              <Button disabled variant="contained" color="primary">
                Join
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
      <ControlBindings
        keybindings={props.keybindings}
        setKeybindings={props.setKeybindings}
      />
    </Container>
  );
}
