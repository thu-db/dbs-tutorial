const fs = require('fs');
const MD5 = require("crypto-js/md5");

let record = {};
try {
    let rawdata = fs.readFileSync('timestamp/data.json', {encoding: "utf-8"});
    record = JSON.parse(rawdata);
}
catch (error) {
    console.log("error: " + error)
}

const current = new Date().toLocaleString("zh-cn", {hour12: false, timeZone: "Asia/Shanghai"});

let fileData = fs.readFileSync('docs/SUMMARY.md', {encoding: "utf-8"});
const iterator = fileData.matchAll( /\(([^)]*)\)/g );
const prefix = "docs/"
for (let it = iterator.next(); !it.done; it = iterator.next()) {
    const filename = it.value[1];
    const path = prefix + filename;
    const targetData = fs.readFileSync(path, {encoding: "utf-8"});
    const md5 = MD5(targetData).toString();
    if (md5 != record[filename]?.md5) {
        console.log("update file " + filename);
        record[filename] = {
            "md5": md5,
            "time": current,
        }
    }
}

fs.writeFileSync('timestamp/data.json', JSON.stringify(record), {encoding: "utf-8"});


rawdata = fs.readFileSync('docs/footer.md', {encoding: "utf-8"});

jsonData = JSON.stringify(record)
// We should prevent "}}"
jsonData = jsonData.substring(0, jsonData.length - 1) + ' }'
rawdata = `{% set timestamp = ${jsonData} %}\n` + rawdata

fs.writeFileSync('docs/footer.md', rawdata, {encoding: "utf-8"});