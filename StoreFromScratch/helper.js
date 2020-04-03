class Helper {
  generateId() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 9)
    );
  }

  createRemoveButton(onClick) {
    const button = document.createElement("button");
    button.innerHTML = "X";
    button.style.padding = "0.5rem 0.7rem";
    button.style.margin = "0.5rem";
    button.style.borderRadius = "12px";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.backgroundColor = "white";
    button.style.boxShadow = "0 2px 5px 1px lightgrey";
    button.addEventListener("click", onClick);
    return button;
  }
}

export default new Helper();
