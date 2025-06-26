"use strict";

// Module import

import {
  addEventsOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElementEditable,
} from "./utils.js";
import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModel } from "./components/Modal.js";

// Toggle sidebar in small screen

const $sidebar = document.querySelector("[data-sidebar]");
const $sidebarTogglers = document.querySelectorAll("[data-sidebar-toggler]");
const $overlay = document.querySelector("[data-sidebar-overlay]");

addEventsOnElements($sidebarTogglers, "click", function () {
  $sidebar.classList.toggle("active");
  $overlay.classList.toggle("active");
});

//Initialize tooltip behavior for all DOM elements with 'data-tooltip' attribute.

const $tooltipelements = document.querySelectorAll("[data-tooltip]");
$tooltipelements.forEach(($elem) => Tooltip($elem));

//show greeting message on homepage

const $greetElement = document.querySelector("[data-greeting]");
const currentHour = new Date().getHours();
$greetElement.textContent = getGreetingMsg(currentHour);

//show current date on homepage

const $currentDateElement = document.querySelector("[data-current-date]");
$currentDateElement.textContent = new Date().toDateString().replace(" ", ", ");

//Notebook create field

const $sidebarList = document.querySelector("[data-sidebar-list]");
const $addNotebookBtn = document.querySelector("[data-add-notebook]");

const showNotebookField = function () {
  const $navItem = document.createElement("div");
  $navItem.classList.add("nav-item");
  $navItem.innerHTML = ` <span class="text text-label-large" data-notebook-field></span>

  <div class="state-layer"></div>`;

  $sidebarList.appendChild($navItem);

  const $navItemField = $navItem.querySelector("[data-notebook-field]");

  activeNotebook.call($navItem);

  makeElementEditable($navItemField);

  $navItemField.addEventListener("keydown", createNotebook);
};

$addNotebookBtn.addEventListener("click", showNotebookField);

const createNotebook = function (event) {
  if (event.key === "Enter") {
    const notebookData = db.post.notebook(this.textContent || "untitled");
    this.parentElement.remove();

    client.notebook.create(notebookData);
  }
};

//Rendering the existing notebook

const renderExistedNotebook = function () {
  const notebookList = db.get.notebook();
  client.notebook.read(notebookList);
};

renderExistedNotebook();

const $noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");

addEventsOnElements($noteCreateBtns, "click", function () {
  const modal = NoteModel();
  modal.open();

  modal.onSubmit((noteObj) => {
    const activeNotebookId = document.querySelector("[data-notebook].active")
      ?.dataset.notebook;

    const noteData = db.post.note(activeNotebookId, noteObj);
    client.note.create(noteData);
    modal.close();
  });
});

const renderExistedNote = function () {
  const activeNotebookId = document.querySelector("[data-notebook].active")
    ?.dataset.notebook;
  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);

    client.note.read(noteList);
  }
};

renderExistedNote();
