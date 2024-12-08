// printFile.js

export class PrintFile {
  static fileList = [];

  constructor(fileData) {
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
    PrintFile.fileList.push(this);
  }
}

export let selectedFileds = [];

/**
 * 複数選択中ファイルの印刷設定を初期化
 */
export function resetSetting() {
  for (const fileId of selectedFileds) {
    const file = PrintFile.fileList[fileId];
    file.paperSize = "自動 (Auto)";
    file.sidedPrint = "しない (1 Sided Print)";
    file.multipleUp = "Nアップしない(1 Page Up)";
    file.outputColor = "白黒 (Black & White)";
    file.collated = true;
    file.sheets = "1";
  }
}

/**
 * 選択ファイルID一覧を直接セット
 */
export function setSelectedFileds(newFileIds) {
  selectedFileds = newFileIds;
}

/**
 * 選択ファイルID一覧に追加
 */
export function addSelectedField(fileId) {
  selectedFileds.push(fileId);
}

/**
 * 選択ファイルID一覧から削除
 */
export function removeSelectedField(fileId) {
  selectedFileds = selectedFileds.filter((value) => value !== fileId);
}
