// main.js
import { chageDom } from './domOperations.js';
import { loadFilesFromSession, saveFilesToSession } from './session.js';
import { PrintFile, selectedFileds, setSelectedFileds, addSelectedField } from './printFile.js';
import { displaySetting, addBrueBorder, addFileHtml } from './domOperations.js';

document.addEventListener("DOMContentLoaded", function () {
  loadFilesFromSession();
});

window.addEventListener("load", () => {
  chageDom();
  loadFilesFromSession();

  const input = document.getElementById("customAddFileUploads");
  input.addEventListener("change", function (e) {
    for (const fileData of e.target.files) {
      const file = new PrintFile(fileData);
      addFileHtml(file);
      saveFilesToSession();
      if (selectedFileds.length === 0) {
        displaySetting(file.id);
        setSelectedFileds([file.id]);
        addBrueBorder();
      }
    }
  });
}, false);
