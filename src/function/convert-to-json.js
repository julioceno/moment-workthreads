const xlsx = require("xlsx");

function convertToJson(buffer) {
  const wb = xlsx.read(buffer, { type: "buffer" });
  const wsName = wb.SheetNames[0];
  const ws = wb.Sheets[wsName];

  const data = xlsx.utils.sheet_to_json(ws);

  return data;
}

module.exports = { convertToJson };
