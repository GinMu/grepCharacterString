const program = require('commander');
const fs = require('fs');
const cheerio = require('cheerio');

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-f, --file <path>', 'source file')
  .option('-r, --record <path>', 'record file')
  .parse(process.argv);

if (!program.file || !program.record) {
  console.log('Please import arguments');
  return;
}

const file = program.file;
const record = program.record;
const template = fs.readFileSync(file, 'utf8');
const $ = cheerio.load(template);

let parseHtml = function () {
  let icons = $('.icons__item i');
  let len = icons.length;
  for (let i = 0; i < len; i++) {
    let iconName = icons[i].attribs.class;
    createFile(iconName);
  }
}

let createFile = function (data) {
  let existed = fs.existsSync(record);
  if (existed) {
    fs.appendFileSync(record, data + '\n');
  } else {
    fs.writeFileSync(record, data + '\n');
  }
}

parseHtml()
