const xlsx = require("xlsx");

function readFile(buffer) {
  const wb = xlsx.read(buffer, { type: "buffer" });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = xlsx.utils.sheet_to_json(ws);

  return data;
}

module.exports = { readFile };
