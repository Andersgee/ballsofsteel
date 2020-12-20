import React, { useState } from "react";
import Lobby from "./Lobby";
import Game from "./Game";
import useGlsl from "../hooks/use-glsl";

const defaultkeybindings = {
  name: ["Up", "Left", "Down", "Right"],
  ispressed: [false, false, false, false],
  code: ["KeyW", "KeyA", "KeyS", "KeyD"],
  key: ["W", "A", "S", "D"],
};

export default function Layout() {
  const [keybindings, setKeybindings] = useState(defaultkeybindings);
  const [connected, setConnected] = useState(false);
  const connect = () => setConnected(true);
  const disconnect = () => setConnected(false);

  const [playername, setPlayername] = useState("");
  const glsl = useGlsl();

  return connected ? (
    <Game
      disconnect={disconnect}
      playername={playername}
      glsl={glsl}
      keybindings={keybindings}
      setKeybindings={setKeybindings}
    />
  ) : (
    <Lobby
      connect={connect}
      setPlayername={setPlayername}
      keybindings={keybindings}
      setKeybindings={setKeybindings}
    />
  );
}
