import React from "react";
import { Typography, Grid } from "@material-ui/core";
import ControlButton from "./ControlButton";

export default function ControlBindings(props) {
  const bind = (i) => (e) => {
    let k = props.keybindings;
    k.code[i] = e.code;
    k.key[i] = e.key;
    props.setKeybindings(k);
  };

  const getkey = (i) => () => props.keybindings.key[i];

  return (
    <Grid container direction="column" spacing={1}>
      {props.keybindings.name.map((name, i) => (
        <Grid key={i} item container spacing={3} justify="space-around">
          <Grid item xs={1}>
            <Typography>{name}</Typography>
          </Grid>
          <Grid item>
            <ControlButton getkey={getkey(i)} bind={bind(i)} />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
