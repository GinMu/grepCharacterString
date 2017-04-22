const program = require('commander');
const fs = require('fs');
const readline = require('readline');
const child_process = require('child_process');

program
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option('-r, --record <path>', 'record file')
    .option('-d, --directory <path>', 'grep directory')
    .option('-s, --savefile <path>', 'grep directory')
    .parse(process.argv);

if (!program.record || !program.directory || !program.savefile) {
    console.log('Please import arguments');
    return;
}
const record = program.record;
const directory = program.directory;
const savefile = program.savefile;

const rl = readline.createInterface({
    input: fs.createReadStream(record),
    output: process.stdout,
    terminal: false
});


const ignoreIcons = [
    'micon-shape-rectangle',
    'micon-shape-triangle',
    'micon-shape-ellipse',
    'micon-shape-line',
    'micon-network-disabled',
    'micon-network-medium',
    'micon-network-strong',
    'micon-network-weak',
    'micon-message'
];

const ignoreString = ignoreIcons.join(',');

const isExist = (line) => {
  return ignoreString.includes(line.trim());
}

rl.on('line', (line) => {
    rl.pause();

    if (isExist(line)) {
      let data = line + '动态生成';
      saveRecord(data);
    } else {
      excuteShell(directory, line);
    }
});



const excuteShell = (directory, line) => {
    let statisticsCommand = getCommand(directory, line);
    child_process.exec(statisticsCommand, {
        encoding: 'utf8'
    }, function(err, output) {
        if (err) {
            console.log('err:' + line);
            excuteShell(directory, line);
            return;
        }
        let data = line + '出现:' + output.trim() + '次';
        saveRecord(data);
    });
}

const saveRecord = (data) => {
    let existed = fs.existsSync(savefile);
    if (existed) {
        fs.appendFileSync(savefile, data + '\n');
    } else {
        fs.writeFileSync(savefile, data + '\n');
    }
    rl.resume();
}

const getCommand = (directory, line) => {
    return 'grep -r ' + line + ' ~/workspace/trunk/moxtra/site/template/  ~/workspace/trunk/moxtra/site/scripts/app ~/workspace/trunk/moxtra/site/scripts/framework ~/workspace/trunk/moxtra/site/scripts/customize' + ' | wc -l';
}
