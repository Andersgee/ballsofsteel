export default class Controller {
  constructor(keybindings) {
    this.keybindings = keybindings;
    window.addEventListener("keydown", this.keyHandler(true));
    window.addEventListener("keyup", this.keyHandler(false));
  }

  keyHandler = (bool) => (e) => {
    let i = this.keybindings.code.indexOf(e.code);
    if (i >= 0 && this.keybindings.ispressed[i] !== bool) {
      this.keybindings.ispressed[i] = bool;
      console.log("this.keybindings.ispressed: ", this.keybindings.ispressed);
    }
  };
}
