import React, { useState } from "react";
import { Button } from "@material-ui/core";

export default function ControlButton(props) {
  const [isselected, setIsselected] = useState(false);

  const handleKey = (e) => {
    window.addEventListener("keydown", choosekey);
    setIsselected(true);
  };

  const choosekey = (e) => {
    props.bind(e);
    window.removeEventListener("keydown", choosekey);
    setIsselected(false);
  };

  return isselected ? (
    <Button variant="contained" color="primary">
      Press a key
    </Button>
  ) : (
    <Button onClick={handleKey} variant="contained" color="primary">
      {props.getkey()}
    </Button>
  );
}
