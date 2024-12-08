// session.js
import { PrintFile, selectedFileds, setSelectedFileds } from './printFile.js';
import { addFileHtml, displaySetting, addBrueBorder } from './domOperations.js';

/**
 * セッションにファイル情報を保存
 */
export function saveFilesToSession() {
  const filesData = PrintFile.fileList
    .filter((file) => file.isExist)
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
}

/**
 * セッションからファイル情報を復元
 */
export function loadFilesFromSession() {
  const storedFiles = sessionStorage.getItem("printFiles");
  if (storedFiles) {
    const filesData = JSON.parse(storedFiles);
    filesData.forEach((fileData) => {
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

      addFileHtml(restoredFile);
    });

    if (selectedFileds.length === 0 && PrintFile.fileList.length > 0) {
      displaySetting(0);
      setSelectedFileds([PrintFile.fileList[0].id]);
      addBrueBorder();
    }
  }
}
