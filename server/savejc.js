const hs = require('helpstack');
const savejsoncsv = require('savejsoncsv');

module.exports = (json = {"A": {"C":"1"}, "B": {"D":"2"}}, name = "jsoncsv") => {
  const zuerstZ = true;
  const leerWert = "xxx";
  const savePath = "/home/micha/Schreibtisch/tests/jsonZuCsv";
  let namejson = [{ name: name, json: json }];
  hs(json);
  savejsoncsv(namejson, savePath, zuerstZ, leerWert).then(() => {
    console.log(`Saved "${name}.json/.csv" in ${savePath}!`);
  }).catch((e) => console.log("Error: ",e));
}
