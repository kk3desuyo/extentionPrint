// main.js
import { changeDom } from './domOperations.js';
import { loadFilesFromSession, saveFilesToSession } from './session.js';
import { PrintFile, selectedFileds, setSelectedFileds, addSelectedField } from './printFile.js';
import { displaySetting, addBrueBorder, addFileHtml } from './domOperations.js';

document.addEventListener("DOMContentLoaded", function () {
  loadFilesFromSession();
});

window.addEventListener("load", () => {
  //アップロード一覧の表示部分の追加　& セッションストレージから未アップロードファイル情報を取得
  changeDom();
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
