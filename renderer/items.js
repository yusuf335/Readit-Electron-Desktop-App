// Fs module
const fs = require("fs");

// DOM nodes
let items = document.getElementById("items");

// Get reader js
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

// Persist storage
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

// Set item as selected
exports.select = (e) => {
  // Remove selected class
  document
    .getElementsByClassName("read-item selected")[0]
    .classList.remove("selected");

  // Add selected class
  e.currentTarget.classList.add("selected");
};

// Arrow item selection
exports.changeSelection = (direction) => {
  // Get selected item
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  // Handle up/down
  if (direction === "ArrowUp" && currentItem.previousElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.nextElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.nextElementSibling.classList.add("selected");
  }
};

// Open selected item
exports.openItem = () => {
  // Only open if we have item
  if (!this.storage.length) return;

  // Get selected item
  let selectedItem = document.getElementsByClassName("read-item selected")[0];

  // Get item' url
  let contentUrl = selectedItem.dataset.url;

  //  Open item in proxy browser
  let readerWin = window.open(
    contentUrl,
    "",
    `
  maxWidth = 2000,
  maxHeight = 2000,
  width = 1200,
  height = 800,
  backgroundColor = #DEDEDE,
  nodeIntegration=0,
  contextIsolation = 1,
  `
  );

  readerWin.eval(readerJS);
};

// Add new Item
exports.addItem = (item, isNew = false) => {
  // Create new DOM
  let itemNode = document.createElement("div");

  // Assign "read-item" class
  itemNode.setAttribute("class", "read-item");

  // Set url as data attribute
  itemNode.setAttribute("data-url", item.url);

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  // Append new Node to "items"

  items.appendChild(itemNode);

  // Add click handler to select
  itemNode.addEventListener("click", this.select);

  // Double click handler to open item
  itemNode.addEventListener("dblclick", this.openItem);

  // Pre-select
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  // Add item to storage and persist
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// Add items from storage when app starts
this.storage.forEach((element) => {
  this.addItem(element);
});
