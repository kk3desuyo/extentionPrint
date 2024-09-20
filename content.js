var selectedFileds = [];
class PrintFile {
  //アップロードファイル一覧
  static fileList = [];
  // コンストラクター
  constructor(fileData) {
    //Fileオブジェクトかの確認
    if (!(fileData instanceof File)) {
      throw new Error("fileData must be a File object");
    }
    this.isExist = true;
    this.name = fileData.name;
    this.id = PrintFile.fileList.length;
    this.fileData = fileData;
    this.paperSize = "自動 (Auto)";
    this.sidedPrint = "しない (1 Sided Print)";
    this.multipleUp = "Nアップしない(1 Page Up)";
    this.outputColor = "白黒 (Black & White)";
    this.collated = true;
    this.sheets = "1";

    // インスタンスをfileListに追加
    PrintFile.fileList.push(this);
    console.log("ファイルインスタンス作成しました。");
  }
}

//印刷設定を変更する(不要なイベント発火を防ぐため)
function safelyUpdateSelect(element, value) {
  // 一時的にイベントリスナーを解除
  const originalEvents = element.onchange;
  element.onchange = null;

  // 値を更新
  element.value = value;

  // 一時的に解除したイベントリスナーを再設定
  setTimeout(() => {
    element.onchange = originalEvents;
  }, 1);
}
//複数選択時用の設定初期化
function resetSetting() {
  for (const fileId of selectedFileds) {
    PrintFile.fileList[fileId].paperSize = "自動 (Auto)";
    PrintFile.fileList[fileId].sidedPrint = "しない (1 Sided Print)";
    PrintFile.fileList[fileId].multipleUp = "Nアップしない(1 Page Up)";
    PrintFile.fileList[fileId].outputColor = "白黒 (Black & White)";
    PrintFile.fileList[fileId].collated = true;
    PrintFile.fileList[fileId].sheets = "1";
    console.log(fileId + "の設定変更");
  }
}

//プリント設定の適用
function displaySetting(selectedFileId) {
  console.log("設定を表示", selectedFileId);
  const selectedFile = PrintFile.fileList[selectedFileId];
  console.log("出力設定を表示します。");
  console.log(`Name: ${selectedFile.name}`);
  console.log(`ID: ${selectedFile.id}`);
  console.log(`File Data: ${selectedFile.fileData}`);
  console.log(`Paper Size: ${selectedFile.paperSize}`);
  console.log(`Sided Print: ${selectedFile.sidedPrint}`);
  console.log(`Multiple-Up: ${selectedFile.multipleUp}`);
  console.log(`Output Color: ${selectedFile.outputColor}`);
  console.log(`Collated: ${selectedFile.collated}`);
  console.log(`Sheets: ${selectedFile.sheets}`);
  safelyUpdateSelect(
    document.getElementById("dlOutputSeatSize"),
    selectedFile.paperSize
  );
  safelyUpdateSelect(
    document.getElementById("dlDuplexType"),
    selectedFile.sidedPrint
  );
  safelyUpdateSelect(document.getElementById("dlNup"), selectedFile.multipleUp);
  safelyUpdateSelect(
    document.getElementById("dlColorMode"),
    selectedFile.outputColor
  );
  document.getElementById("ckSort").checked = selectedFile.collated; // corrected 'checkd' to 'checked'
  safelyUpdateSelect(document.getElementById("tCopies"), selectedFile.sheets);
  console.log(selectedFileId);
}
//プリントジョブのファイル選択部分を書き換え
function chageDom() {
  console.log("DOMを修正しました。");

  let main = document.querySelector(".main");
  if (main) {
    //アップロードファイル表示ディスプレイ
    main.insertAdjacentHTML(
      //アップロード一覧を追加
      "afterbegin",
      '<fieldset id="displayUploads"><legend><span id="lbFileSelect" style="font-size: Medium">アップロードされているファイル</span></legend><file-slider><image-slider><div class="c-inner"><div class="c-slider" data-slider></div></div></image-slider></file-slider></fieldset>'
    );
    //jsの追加
    main.insertAdjacentHTML(
      //アップロード一覧を追加
      "afterbegin",
      '<script>class ImageSlider extends HTMLElement { edge = "start"; styles = getComputedStyle(this); move = parseInt(this.styles?.getPropertyValue("--move"), 10) || 1; gap = parseInt(this.styles?.getPropertyValue("--gap"), 10) || 0; slider = this.querySelector("[data-slider]"); navBtns = this.querySelectorAll("[data-nav-btn]"); image = this.slider?.querySelector("img"); controller = new AbortController(); timer; constructor() { super(); } connectedCallback() { if (this.slider) { this.detectScrollEdge(); const { signal } = this.controller; this.slider.addEventListener("scroll", () => { this.debounce(this.detectScrollEdge, 50); }, { signal }); window.addEventListener("resize", () => { this.debounce(this.detectScrollEdge, 50); }, { signal }); this.navBtns.forEach((btn) => btn.addEventListener("click", () => { this.slider.scrollLeft = this.calcScrollLeft(btn); }, { signal })); } } disconnectedCallback() { this.controller.abort(); } static get observedAttributes() { return ["edge"]; } attributeChangedCallback(name, oldValue, newValue) { if (this.navBtns && name === "edge") { this.navBtns.forEach((btn) => btn.removeAttribute("aria-disabled")); if (this.navBtns[0] && newValue === "start") { this.navBtns[0].setAttribute("aria-disabled", "true"); } else if (this.navBtns[1] && newValue === "end") { this.navBtns[1].setAttribute("aria-disabled", "true"); } } } detectScrollEdge = () => { const scrollLeft = this.slider.scrollLeft; const scrollRight = this.slider.scrollWidth - (scrollLeft + this.slider.clientWidth); if (scrollLeft <= 0) { this.edge = "start"; } else if (scrollRight <= 1) { this.edge = "end"; } else { this.edge = "false"; } if (this.getAttribute("edge") !== this.edge) { this.setAttribute("edge", this.edge); } }; calcScrollLeft = (btn) => { const dir = btn.getAttribute("data-nav-btn") === "prev" ? -1 : 1; const imageSize = this.image?.clientWidth ?? 300; const totalItemsSize = imageSize * this.move; const totalGap = this.gap * this.move; return this.slider.scrollLeft + dir * (totalItemsSize + totalGap); }; debounce = (fn, interval = 50) => { clearTimeout(this.timer); this.timer = setTimeout(() => fn(), interval); }; } customElements.define("image-slider", ImageSlider);</script>'
    );
    //cssの追加
    main.insertAdjacentHTML(
      "afterbegin",
      '<style>  #displayUploads{height:10vh}file-slider {height: 100%;}image-slider {height: 100%;}.fileCard-1{height:90%}.side-panel { width: 100vw; height: 80vh; } .file-img { width: 100px; height: 100px; } .file-name { margin: 2px 0 0; padding-bottom: 0; } image-slider { --show-items: 2; --glance: 0.5; --move: 1; --gap: 20px; --item-min-size: 150px; --item-max-size: 200px; --scroll-snap-align: start; --scrollbar-margin: 20px; --scrollbar-width: 12px; display: block; padding: var(--slider-padding); } image-slider .c-inner { --item-size: calc((100% - var(--show-items) * var(--gap)) / (var(--show-items) + var(--glance))); display: grid; row-gap: 20px; } image-slider .c-slider { display: flex; gap: var(--gap); overflow-x: auto; padding-block-end: var(--scrollbar-margin); scroll-snap-type: inline mandatory; scroll-behavior: smooth; } image-slider .c-item { flex: 0 0 clamp(var(--item-min-size), var(--item-size), var(--item-max-size)); scroll-snap-align: var(--scroll-snap-align); } image-slider .c-item img { display: block; inline-size: 100%; block-size: auto; aspect-ratio: 1; object-fit: cover; } image-slider .c-nav { display: grid; grid-template-columns: repeat(2, auto); column-gap: 16px; justify-content: end; transition: opacity 0.2s ease; } image-slider .c-nav-btn { --btn-size: 50px; --btn-color: #004d4d; --btn-color-hover: color-mix(in srgb, var(--btn-color) 80%, white); display: grid; gap: 4px; align-content: center; place-items: center; inline-size: var(--btn-size); block-size: var(--btn-size); padding: 4px; border: 2px solid var(--btn-color); border-radius: 50%; background: none; cursor: pointer; transition: opacity 0.2s ease; } image-slider .c-nav-btn[aria-disabled="true"] { opacity: 0.4; cursor: default; } image-slider .c-nav-svg { inline-size: 18px; margin-inline: auto; } image-slider .c-nav-svg path { fill: none; stroke: var(--btn-color); stroke-linecap: round; stroke-linejoin: round; stroke-width: 1px; transition: stroke 0.2s ease; } @media (hover) { image-slider .c-nav-btn:not([aria-disabled="true"]):hover { background-color: var(--btn-color-hover); } image-slider .c-nav-btn:not([aria-disabled="true"]):hover path { stroke: #fff; } } @layer utilities { .sr-only { position: absolute; overflow: hidden; clip: rect(0, 0, 0, 0); inline-size: 1px; block-size: 1px; margin: -1px; padding: 0; border-width: 0; white-space: nowrap; } }</style>'
    );
    // main.insertAdjacentHTML(
    //   "beforeend",
    //   '<fieldset><legend><span id="lbFileSelect" style="font-size:Medium;">ファイル選択 (Select File)</span></legend><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="lSelectFile" style="font-size:Medium;">印刷するファイルを選択してください。(Please click the "参照..." or "ファイルを選択" button, and choose a file to print.)</span><br><br><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;</div><input type="file" name="FileUpload1" id="addFileUploads" class="fileUpload multiple"><br><br><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="lSupportFormat" style="font-size:Medium;">※対応フォーマット (Supported File Formats)</span><br><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><span id="lFormat_PDF" style="font-size:Medium;">PDF(*.pdf)、XPS(*.xps)、TIFF(*.tif/*.tiff)、JPEG(*.jpg/*jpeg)、Word(*.doc/*.docx)、Excel(*.xls/*.xlsx)、PowerPoint(*.ppt/*.pptx)</span><br></fieldset>'
    // );
  } else {
    console.log("mainタグが見つかりせん。");
  }

  //複数選択可能なファイル選択画面を追加
  let displayUploads = document.querySelector("#displayUploads");
  if (displayUploads) {
    var customHTML =
      '<fieldset id="customFileUploadFieldset"><legend><span id="customLbFileSelect" style="font-size:Medium;">ファイル選択 (Select File)</span></legend><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="customLSelectFile" style="font-size:Medium;">印刷するファイルを選択してください。(Please click the "参照..." or "ファイルを選択" button, and choose a file to print.)</span><br><br><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;</div><input type="file" name="customFileUpload" id="customAddFileUploads" class="customFileUpload" multiple=""><br><br><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="customLSupportFormat" style="font-size:Medium;">※対応フォーマット (Supported File Formats)</span><br><div class="custom-disp-nbsp">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><span id="customLFormat_PDF" style="font-size:Medium;">PDF(*.pdf)、XPS(*.xps)、TIFF(*.tif/*.tiff)、JPEG(*.jpg/*jpeg)、Word(*.doc/*.docx)、Excel(*.xls/*.xlsx)、PowerPoint(*.ppt/*.pptx)</span><br></fieldset>';
    displayUploads.insertAdjacentHTML("afterend", customHTML);
    // let newFieldset = document.createElement("fieldset");
    // newFieldset.innerHTML =
    //   '<legend><span id="lbFileSelect" style="font-size:Medium;">ファイル選択 (Select File)</span></legend><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="lSelectFile" style="font-size:Medium;">印刷するファイルを選択してください。(Please click the "参照..." or "ファイルを選択" button, and choose a file to print.)</span><br><br><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;</div><input type="file" name="FileUpload1" id="addFileUploads" class="fileUpload"multiple><br><br><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;</div><span id="lSupportFormat" style="font-size:Medium;">※対応フォーマット (Supported File Formats)</span><br><div class="disp-nbsp">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><span id="lFormat_PDF" style="font-size:Medium;">PDF(*.pdf)、XPS(*.xps)、TIFF(*.tif/*.tiff)、JPEG(*.jpg/*jpeg)、Word(*.doc/*.docx)、Excel(*.xls/*.xlsx)、PowerPoint(*.ppt/*.pptx)</span><br>';

    // displayUploads.insertAdjacentElement("afterend", newFieldset);
  } else {
    console.log("displayUploadsセレクターが見つかりません");
  }
}
//選択中ファイルの青線を取り除く
function removeBrueBorder() {
  for (const fileId of selectedFileds) {
    const fileCard = document.getElementById(
      "fileCard-" + PrintFile.fileList[fileId].id
    );
    // 枠線を青色から消去する
    fileCard.classList.remove("blue-border");
  }
}
//選択中ファイルの青線をつける
function addBrueBorder() {
  for (const fileId of selectedFileds) {
    //枠線追加
    const fileCard = document.getElementById(
      "fileCard-" + PrintFile.fileList[fileId].id
    );
    fileCard.classList.add("blue-border");
  }
}
//ファイルの消去
function deleteFile(fileId) {
  PrintFile.fileList[fileId].isExist = false;
  //ファイルhtmlタグを消去
  var fileCard = document.getElementById("fileCard-" + fileId);
  // 親要素を削除
  fileCard.remove();
  console.log("#fileCard-" + fileId + " を削除しました");
  saveFilesToSession();
  //ファイルが存在するかのフラグ
  var isExistFile = 0;
  //選択ファイルを存在するファイルに移動
  for (const file of PrintFile.fileList) {
    console.log(file);
    if (file.isExist == true) {
      isExistFile = 1;
      console.log(file.id, "に変更します。");
      selectedFileds = [];
      selectedFileds = [file.id];
      console.log(selectedFileds);
      //青線追加
      addBrueBorder();
      displaySetting(file.id);
      break;
    }
  }
  //ファイルが一つも存在しない場合の処理
  if (!isExistFile) {
    selectedFileds = [];
  }
  console.log(selectedFileds, "に選択ファイルを更新しました。");
}
//ファイルインスタンスを受け取って、ファイル一覧のところに表示
function addFileHtml(file) {
  console.log(PrintFile.fileList);
  var fileName, extension;
  //ファイル名が長い場合の短縮
  if (file.name.length >= 7) {
    fileName = file.name.substring(0, 6);
  }
  extension = file.name.substring(file.name.indexOf("."));
  console.log(extension);
  var fileImgPath;
  //ファイルのアイコン判定
  switch (extension) {
    case ".pdf":
      fileImgPath = chrome.runtime.getURL("img/pdf.png");
      break;
    case ".tif":
    case ".tiff":
      fileImgPath = chrome.runtime.getURL("img/tiff.png");
      break;
    case ".jpg":
    case ".jpeg":
    case ".JPG":
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

  console.log(fileImgPath);

  //インスタンス用のタグを作成
  const nodeFile =
    '<div id="fileCard-' +
    file.id +
    '" style="position: relative;"> <button type="button" class="file" id="file-' +
    file.id +
    '"><p class="file-name">' +
    fileName +
    extension +
    '</p><img class="file-img" src="' +
    fileImgPath +
    '" alt="ファイルのイメージ画像"></button><span class="round_btn" id="roundButton-' +
    file.id +
    '"></span>  <!-- バツボタンを追加 --></div><style>.blue-border{      border-color: aqua;border-width: 3px;border-style: solid;}</style>';
  const nodeCss =
    '<style>.round_btn { display: block; position: absolute; top: 120; right: 0; width: 30px; height: 30px; border: 2px solid #333; border-radius: 50%; background: #fff; cursor: pointer; transform: translate(50%, -50%); box-shadow: 0 2px 5px rgba(0,0,0,0.2); } .round_btn::before, .round_btn::after { content: ""; position: absolute; top: 50%; left: 50%; width: 3px; height: 22px; background: #333; } .round_btn::before { transform: translate(-50%, -50%) rotate(45deg); } .round_btn::after { transform: translate(-50%, -50%) rotate(-45deg); }</style>';

  const cSlider = document.querySelector(".c-slider");
  if (cSlider) {
    cSlider.insertAdjacentHTML("afterbegin", nodeFile);
    cSlider.insertAdjacentHTML("afterbegin", nodeCss);
    //消去バタンのリスナー追加
    const deleteButton = document.getElementById("roundButton-" + file.id);
    deleteButton.addEventListener("click", () => deleteFile(file.id));
    //イベントリスナーの追加
    const fileButton = document.getElementById("file-" + file.id);
    fileButton.addEventListener("click", (event) => {
      //枠線を取り除く(複数、単体選択共通処理)
      removeBrueBorder();

      //ファイルの設定を保存
      var outputSizeSelect = document.getElementById("dlOutputSeatSize");
      var sidedPrintSelect = document.getElementById("dlDuplexType");
      var multipleUpSelect = document.getElementById("dlNup");
      var colorModeSelect = document.getElementById("dlColorMode");
      var collatedCheckbox = document.getElementById("ckSort");
      var sheetsInput = document.getElementById("tCopies");
      for (const fileId of selectedFileds) {
        PrintFile.fileList[fileId].paperSize = outputSizeSelect.value;
        PrintFile.fileList[fileId].sidedPrint = sidedPrintSelect.value;
        PrintFile.fileList[fileId].multipleUp = multipleUpSelect.value;
        PrintFile.fileList[fileId].outputColor = colorModeSelect.value;
        PrintFile.fileList[fileId].collated = collatedCheckbox.checked;
        PrintFile.fileList[fileId].sheets = sheetsInput.value;
        console.log(fileId + "の設定変更");
      }
      //セッションに設定を保存
      saveFilesToSession();
      //SHIFTキー同時のクリック(ファイル複数選択)
      if (event.shiftKey) {
        //すでにせんたくされている場合(選択中リストから取り除く)
        if (selectedFileds.includes(file.id)) {
          selectedFileds = selectedFileds.filter(function (value) {
            return value != file.id;
          });
        }
        //含まれていない場合
        else {
          selectedFileds.push(file.id);
        }
        //一番最後に選択したファイルの印刷設定で初期
        resetSetting();
        //単体でのファイル印刷設定
      } else {
        //選択ファイルのリセット
        selectedFileds = [];
        selectedFileds.push(file.id);
      }

      console.log("選択中ファイル一覧" + selectedFileds);
      displaySetting(file.id);
      //枠線の追加(複数単体共通処理)
      addBrueBorder();
    });
  } else {
    console.log("cSliderタグが見つかりせん。");
  }
}
//セッションファイルの復元
function loadFilesFromSession() {
  const storedFiles = sessionStorage.getItem("printFiles");
  if (storedFiles) {
    const filesData = JSON.parse(storedFiles);
    filesData.forEach((fileData) => {
      // ファイルデータを復元するために、新しいファイルオブジェクトを作成
      const restoredFile = new PrintFile(
        new File([""], fileData.name, {
          type: "application/octet-stream",
          lastModified: new Date(),
        })
      );
      restoredFile.isExist = fileData.isExist;
      restoredFile.paperSize = fileData.paperSize;
      restoredFile.sidedPrint = fileData.sidedPrint;
      restoredFile.multipleUp = fileData.multipleUp;
      restoredFile.outputColor = fileData.outputColor;
      restoredFile.collated = fileData.collated;
      restoredFile.sheets = fileData.sheets;

      // HTMLに追加
      addFileHtml(restoredFile);
      console.log(PrintFile.fileList);
    });
    console.log("セッションストレージからファイル情報を復元しました。");

    // セッションにデータがある場合にのみ
    if (selectedFileds.length == 0 && PrintFile.fileList.length > 0) {
      displaySetting(0);
      selectedFileds.push(PrintFile.fileList[0].id);
      addBrueBorder();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadFilesFromSession();
});

//セッションにファイルを追加
function saveFilesToSession() {
  // セッションストレージを更新
  const filesData = PrintFile.fileList
    .filter((file) => file.isExist) // isExistがtrueのもののみフィルタリング
    .map((file) => ({
      isExist: file.isExist,
      name: file.name,
      id: file.id,
      paperSize: file.paperSize,
      sidedPrint: file.sidedPrint,
      multipleUp: file.multipleUp,
      outputColor: file.outputColor,
      collated: file.collated,
      sheets: file.sheets,
    }));

  sessionStorage.setItem("printFiles", JSON.stringify(filesData));
  console.log("ファイル情報をセッションストレージに更新しました。");
}

window.addEventListener(
  "load",
  () => {
    //DOMの変更
    chageDom();
    loadFilesFromSession();
    const input = document.getElementById("customAddFileUploads");
    //ファイルのリスナー追加
    input.addEventListener("change", function (e) {
      console.log("ファイルのアップロードを検知しました。");
      console.log(e.target.files);
      for (const fileData of e.target.files) {
        console.log("追加");
        var file = new PrintFile(fileData);

        addFileHtml(file);
        saveFilesToSession();
        //初回のみ
        if (selectedFileds.length == 0) {
          displaySetting(file.id);
          selectedFileds.push(file.id);
          addBrueBorder();
        }
      }
    });
  },
  false
);

//設定
