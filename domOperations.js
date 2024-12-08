// domOperations.js
import { PrintFile, selectedFileds, resetSetting, setSelectedFileds, addSelectedField, removeSelectedField } from './printFile.js';
import { saveFilesToSession } from './session.js';

/**
 * 安全にSelect要素を更新
 */
export function safelyUpdateSelect(element, value) {
  const originalEvents = element.onchange;
  element.onchange = null;
  element.value = value;
  setTimeout(() => {
    element.onchange = originalEvents;
  }, 1);
}

/**
 * 選択中ファイル設定を表示
 */
export function displaySetting(selectedFileId) {
  const selectedFile = PrintFile.fileList[selectedFileId];
  safelyUpdateSelect(document.getElementById("dlOutputSeatSize"), selectedFile.paperSize);
  safelyUpdateSelect(document.getElementById("dlDuplexType"), selectedFile.sidedPrint);
  safelyUpdateSelect(document.getElementById("dlNup"), selectedFile.multipleUp);
  safelyUpdateSelect(document.getElementById("dlColorMode"), selectedFile.outputColor);
  document.getElementById("ckSort").checked = selectedFile.collated;
  safelyUpdateSelect(document.getElementById("tCopies"), selectedFile.sheets);
}

/**
 * 初期DOM構造を変更（ファイル一覧表示領域追加）
 */
export function changeDom() {
  let main = document.querySelector(".main");
  if (main) {
    main.insertAdjacentHTML(
      "afterbegin",
      '<fieldset id="displayUploads"><legend><span id="lbFileSelect" style="font-size: Medium">アップロードされているファイル</span></legend><file-slider><image-slider><div class="c-inner"><div class="c-slider" data-slider></div></div></image-slider></file-slider></fieldset>'
    );

    // ここにImageSliderクラスの<script>タグ、CSSスタイルを同様にinsertAdjacentHTMLで挿入してください
    // （略）

    let displayUploads = document.querySelector("#displayUploads");
    if (displayUploads) {
      const customHTML =
        '<fieldset id="customFileUploadFieldset"><legend><span id="customLbFileSelect" style="font-size:Medium;">ファイル選択 (Select File)</span></legend><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="customLSelectFile" style="font-size:Medium;">印刷するファイルを選択してください。(Please click the "参照..." or "ファイルを選択" button, and choose a file to print.)</span><br><br><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;</div><input type="file" name="customFileUpload" id="customAddFileUploads" class="customFileUpload" multiple=""><br><br><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="customLSupportFormat" style="font-size:Medium;">※対応フォーマット (Supported File Formats)</span><br><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><span id="customLFormat_PDF" style="font-size:Medium;">PDF(*.pdf)、XPS(*.xps)、TIFF(*.tif/*.tiff)、JPEG(*.jpg/*jpeg)、Word(*.doc/*.docx)、Excel(*.xls/*.xlsx)、PowerPoint(*.ppt/*.pptx)</span><br></fieldset>';
      displayUploads.insertAdjacentHTML("afterend", customHTML);
    }
  }
}

/**
 * 選択中ファイルの青枠線を除去
 */
export function removeBrueBorder() {
  for (const fileId of selectedFileds) {
    const fileCard = document.getElementById("fileCard-" + PrintFile.fileList[fileId].id);
    fileCard.classList.remove("blue-border");
  }
}

/**
 * 選択中ファイルに青枠線を追加
 */
export function addBrueBorder() {
  for (const fileId of selectedFileds) {
    const fileCard = document.getElementById("fileCard-" + PrintFile.fileList[fileId].id);
    fileCard.classList.add("blue-border");
  }
}

/**
 * ファイル削除処理
 */
export function deleteFile(fileId) {
  PrintFile.fileList[fileId].isExist = false;
  const fileCard = document.getElementById("fileCard-" + fileId);
  fileCard.remove();
  saveFilesToSession();

  let newSelectedFile = null;
  for (const file of PrintFile.fileList) {
    if (file.isExist) {
      newSelectedFile = file;
      setSelectedFileds([file.id]);
      addBrueBorder();
      displaySetting(file.id);
      break;
    }
  }

  if (!newSelectedFile) {
    setSelectedFileds([]);
  }
}

/**
 * ファイル一覧表示HTML要素追加
 */
export function addFileHtml(file) {
  let fileName = file.name;
  if (file.name.length >= 7) {
    fileName = file.name.substring(0, 6);
  }
  const extension = file.name.substring(file.name.indexOf("."));
  let fileImgPath;

  switch (extension.toLowerCase()) {
    case ".pdf":
      fileImgPath = chrome.runtime.getURL("img/pdf.png");
      break;
    case ".tif":
    case ".tiff":
      fileImgPath = chrome.runtime.getURL("img/tiff.png");
      break;
    case ".jpg":
    case ".jpeg":
      fileImgPath = chrome.runtime.getURL("img/jpg.png");
      break;
    case ".doc":
    case ".docx":
      fileImgPath = chrome.runtime.getURL("img/doc.png");
      break;
    case ".xls":
    case ".xlsx":
      fileImgPath = chrome.runtime.getURL("img/xls.png");
      break;
    case ".ppt":
    case ".pptx":
      fileImgPath = chrome.runtime.getURL("img/ppt.png");
      break;
    default:
      fileImgPath = chrome.runtime.getURL("img/file-icon.png");
  }

  const nodeFile =
    `<div id="fileCard-${file.id}" style="position: relative;"> 
       <button type="button" class="file" id="file-${file.id}">
         <p class="file-name">${fileName}${extension}</p>
         <img class="file-img" src="${fileImgPath}" alt="ファイルのイメージ画像">
       </button>
       <span class="round_btn" id="roundButton-${file.id}"></span>
     </div>
     <style>
       .blue-border { border-color: aqua; border-width: 3px; border-style: solid; }
     </style>`;

  const nodeCss =
    `<style>
       .round_btn {
         display: block; position: absolute; top: 120; right: 0;
         width: 30px; height: 30px; border: 2px solid #333;
         border-radius: 50%; background: #fff; cursor: pointer;
         transform: translate(50%, -50%); box-shadow: 0 2px 5px rgba(0,0,0,0.2);
       }
       .round_btn::before, .round_btn::after {
         content: ""; position: absolute; top: 50%; left: 50%;
         width: 3px; height: 22px; background: #333;
       }
       .round_btn::before { transform: translate(-50%, -50%) rotate(45deg); }
       .round_btn::after { transform: translate(-50%, -50%) rotate(-45deg); }
     </style>`;

  const cSlider = document.querySelector(".c-slider");
  if (cSlider) {
    cSlider.insertAdjacentHTML("afterbegin", nodeFile);
    cSlider.insertAdjacentHTML("afterbegin", nodeCss);

    // 削除ボタンイベント
    const deleteButton = document.getElementById("roundButton-" + file.id);
    deleteButton.addEventListener("click", () => {
      deleteFile(file.id);
    });

    const fileButton = document.getElementById("file-" + file.id);
    fileButton.addEventListener("click", (event) => {
      removeBrueBorder();
      const outputSizeSelect = document.getElementById("dlOutputSeatSize");
      const sidedPrintSelect = document.getElementById("dlDuplexType");
      const multipleUpSelect = document.getElementById("dlNup");
      const colorModeSelect = document.getElementById("dlColorMode");
      const collatedCheckbox = document.getElementById("ckSort");
      const sheetsInput = document.getElementById("tCopies");

      for (const fileId of selectedFileds) {
        const currentFile = PrintFile.fileList[fileId];
        currentFile.paperSize = outputSizeSelect.value;
        currentFile.sidedPrint = sidedPrintSelect.value;
        currentFile.multipleUp = multipleUpSelect.value;
        currentFile.outputColor = colorModeSelect.value;
        currentFile.collated = collatedCheckbox.checked;
        currentFile.sheets = sheetsInput.value;
      }

      saveFilesToSession();

      if (event.shiftKey) {
        if (selectedFileds.includes(file.id)) {
          removeSelectedField(file.id);
        } else {
          addSelectedField(file.id);
        }
        resetSetting();
      } else {
        setSelectedFileds([file.id]);
      }

      displaySetting(file.id);
      addBrueBorder();
    });
  }
}
