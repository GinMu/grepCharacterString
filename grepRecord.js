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

rl.on('line', (line) => {
    excuteShell(directory, line);
})


const excuteShell = (directory, line) => {
    let statisticsCommand = getCommand(directory, line);
    child_process.exec(statisticsCommand, {
        encoding: 'utf8'
    }, function(err, output) {
        if (err) {
          throw err;
        }
        let data = line + '出现:' + output.trim() + '次'
        let existed = fs.existsSync(savefile);
        if (existed) {
          fs.appendFileSync(savefile, data + '\n');
        } else {
          fs.writeFileSync(savefile, data + '\n');
        }
    });
}

const getCommand = (directory, line) => {
    return 'grep -r ' + line + ' ' + directory + ' | wc -l';
}
