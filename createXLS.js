const ExcelJS = require("exceljs");

/**
 * Create XLS buffer object, it will be used by Telegram to generate xls file
 * @param {Array<object>} videosList JSON data - videos from youtube api
 * @param {string} username channel's nickname, to name sheet
 * @returns {Promise<Buffer>}
 */
const createXLS = async (videosList, username) => {
  if (username[0] !== "@") username = `@${username}`; // always make @ in list
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(username, {
    pageSetup: { paperSize: 9, orientation: "portrait" },
  });

  // Initialize the row index
  let rowIndex = 2;

  /* header begin*/
  let row = worksheet.getRow(rowIndex);
  row.values = ["#", "Название видео", "Описание"];
  row.font = { bold: true };
  /* header end */

  const columnWidths = [20, 100, 200];

  row.eachCell((cell, colNumber) => {
    const columnIndex = colNumber - 1;
    const columnWidth = columnWidths[columnIndex];
    worksheet.getColumn(colNumber).width = columnWidth;
  });

  /* fill start */
  // Loop over the grouped data
  videosList.forEach((video, index) => {
    const row = worksheet.getRow(rowIndex + index + 1);
    row.getCell("A").value = video.id;
    row.getCell("B").value = video.title;
    row.getCell("C").value = video.description;

    row.getCell("B").alignment = { wrapText: true };
    row.getCell("C").alignment = { wrapText: true };
  });
  // Increment the row index
  rowIndex += videosList.length;
  /* fill end */

  // Define the border style
  const borderStyle = {
    style: "thin", // You can use 'thin', 'medium', 'thick', or other valid styles
    color: { argb: "00000000" },
  };

  // Loop through all cells and apply the border style
  worksheet.eachRow((row, _rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, _colNumber) => {
      cell.border = {
        top: borderStyle,
        bottom: borderStyle,
      };
    });
  });

  // Generate the XLS file
  return workbook.xlsx.writeBuffer();
};

module.exports = createXLS;
