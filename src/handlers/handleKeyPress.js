import {
  handleEnter,
  handleTab,
  handleEscape,
  handleArrowUp,
  handleArrowDown,
} from "./index";

function handleKeyPress(e) {

  if (e.shiftKey || e.ctrlKey || e.altKey) {
    return;
  }

  const arrowDownKey = 40, arrowUpKey = 38, enterKey = 13, escapeKey = 27, tabKey = 9;

  if ([arrowDownKey, arrowUpKey, enterKey, escapeKey, tabKey].includes(e.which)) {

    switch (e.which) {
      case arrowUpKey:
        handleArrowUp(e, this);
        break;
      case arrowDownKey:
        handleArrowDown(e, this);
        break;
      case enterKey:
        handleEnter(e, this);
        break;
      case tabKey:
        handleTab(e, this);
        break;
      case escapeKey:
        handleEscape(e, this);
        break;
    }
  }
}

export default handleKeyPress;