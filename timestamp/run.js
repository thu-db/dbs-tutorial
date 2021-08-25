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
for (let it = iterator.next(); !it.done; it = iterator.next()) {
    const filename = 'docs/' + it.value[1];
    const targetData = fs.readFileSync(filename, {encoding: "utf-8"});
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


rawdata = fs.readFileSync('book.json', {encoding: "utf-8"});
const book = JSON.parse(rawdata);
book.timestamp = record;
fs.writeFileSync('book.json', JSON.stringify(book), {encoding: "utf-8"});