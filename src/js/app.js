import * as bootstrap from "bootstrap";
import "core-js";
import "regenerator-runtime";

const helloButton = document.querySelector("button");
const hiddenDivHello = document.querySelector(".visually-hidden");
const clickedBefore = false;

helloButton.addEventListener("click", (event) => {
    hiddenDivHello.classList.toggle("visually-hidden");
})

