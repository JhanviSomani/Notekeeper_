"use strict";

import { NavItem } from "./components/NavItem.js";
import { activeNotebook } from "./utils.js";
import { card } from "./components/Card.js";

const $sidebarList = document.querySelector("[data-sidebar-list]");
const $notePanelTitle = document.querySelector("[data-note-panel-title]");
const $notePanel = document.querySelector("[data-note-panel]");
const $noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");
const emptyNotesTemplates = `<div class="empty-notes">
        <span class="material-symbols-rounded" aria-hidden="true"
          >note_stack</span
        >
        <div class="text-headline-small">No notes</div>
      </div>`;

const disabledNoteCreateBtns = function (isThereAnyNotebooks) {
  $noteCreateBtns.forEach(($item) => {
    $item[isThereAnyNotebooks ? "removeAttribute" : "setAttribute"](
      "disabled",
      ""
    );
  });
};

export const client = {
  notebook: {
    create(notebookData) {
      const $navItem = NavItem(notebookData.id, notebookData.name);

      $sidebarList.appendChild($navItem);
      activeNotebook.call($navItem);
      $notePanelTitle.textContent = notebookData.name;
      $notePanel.innerHTML = emptyNotesTemplates;
      disabledNoteCreateBtns(true);
    },

    read(notebookList) {
      disabledNoteCreateBtns(notebookList.length);
      notebookList.forEach((notebookData, index) => {
        const $navItem = NavItem(notebookData.id, notebookData.name);

        if (index === 0) {
          activeNotebook.call($navItem);
          $notePanelTitle.textContent = notebookData.name;
        }

        $sidebarList.appendChild($navItem);
      });
    },

    update(notebookId, notebookData) {
      const $oldNotebook = document.querySelector(
        `[data-notebooks="${notebookId}"]`
      );
      const $newNotebook = NavItem(notebookData.id, notebookData.name);

      $notePanelTitle.textContent = notebookData.name;
      $sidebarList.replaceChild($newNotebook, $oldNotebook);
      activeNotebook.call($newNotebook);
    },

    delete(notebookId) {
      const $deletedNotebook = document.querySelector(
        `[data-notebook="${notebookId}"]`
      );
      const $activeNavItem =
        $deletedNotebook.nextElementSibling ??
        $deletedNotebook.previousElementSibling;

      if ($activeNavItem) {
        $activeNavItem.click();
      } else {
        $notePanelTitle.innerHTML = "";
        $notePanel.innerHTML = "";
        disabledNoteCreateBtns(false);
      }

      $deletedNotebook.remove();
    },
  },

  note: {
    create(noteData) {
      if (!$notePanel.querySelector("[data-note]")) $notePanel.innerHTML = "";

      const $card = card(noteData);
      $notePanel.prepend($card);
    },

    read(noteList) {
      if (noteList.length) {
        $notePanel.innerHTML = "";
        noteList.forEach((noteData) => {
          const $card = card(noteData);
          $notePanel.appendChild($card);
        });
      } else {
        $notePanel.innerHTML = emptyNotesTemplates;
      }
    },

    update(noteId, noteData) {
      const $oldCard = document.querySelector(`[data-note='${noteId}']`);

      const $newCard = card(noteData);

      $notePanel.replaceChild($newCard, $oldCard);
    },

    delete(noteId, isNoteExists) {
      document.querySelector(`[data-note='${noteId}']`).remove();
      if (!isNoteExists) $notePanel.innerHTML = emptyNotesTemplates;
    },
  },
};
