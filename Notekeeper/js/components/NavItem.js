"use strict";

import { Tooltip } from "./Tooltip.js";
import { activeNotebook, makeElementEditable } from "../utils.js";
import { db } from "../db.js";
import { client } from "../client.js";
import { DeleteConfirmModal } from "./Modal.js";

const $notePanelTitle = document.querySelector("[data-note-panel-title]");

export const NavItem = function (id, name) {
  const $navItem = document.createElement("div");
  $navItem.classList.add("nav-item");
  $navItem.setAttribute("data-notebook", id);

  $navItem.innerHTML = `<span
      class="text text-label-large"
      data-notebook-field
      >${name}</span
    >
    <button
      class="icon-btn small"
      aria-label="Edit-notebook"
      data-tooltip="Edit Notebook"
      data-edit-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">edit</span>

      <div class="state-layer"></div>
    </button>

    <button
      class="icon-btn small"
      aria-label="Delete-notebook"
      data-tooltip="Delete Notebook"
      data-delete-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">delete</span>
    </button>
    <div class="state-layer"></div>`;

  const $tooltipElems = $navItem.querySelectorAll("[data-tooltip]");
  $tooltipElems.forEach(($elem) => Tooltip($elem));

  $navItem.addEventListener("click", function () {
    $notePanelTitle.textContent = name;
    activeNotebook.call(this);

    const noteList = db.get.note(this.dataset.notebook);
    client.note.read(noteList);
  });

  //Notebook edit functionality

  const $navItemEditBtn = $navItem.querySelector("[data-edit-btn]");
  const $navItemField = $navItem.querySelector("[data-notebook-field]");

  $navItemEditBtn.addEventListener(
    "click",
    makeElementEditable.bind(null, $navItemField)
  );

  $navItemField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      this.removeAttribute("contenteditable");

      const updatedNotebookData = db.update.notebook(id, this.textContent);

      client.notebook.update(id, updatedNotebookData);
    }
  });

  //Notebook delete functionality

  const $navItemDeleteBtn = $navItem.querySelector("[data-delete-btn]");
  $navItemDeleteBtn.addEventListener("click", function () {
    const modal = DeleteConfirmModal(name);
    modal.open();

    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        db.delete.notebook(id);
        client.notebook.delete(id);
      }

      modal.close();
    });
  });
  return $navItem;
};
