(async () => {
  var fs = require('fs').promises;

  var raw;
  raw = await fs.readFile('./day15/data-15.txt', 'utf8');

  var matchs = raw
    .split('\n')
    .map((line) => [
      ...line.matchAll(/((?:x=)(?<x>-?\d+)(?:, y=)(?<y>-?\d+)+)/g),
    ]);

  var data = matchs.map((match) => {
    return {
      sensor: {
        x: Number(match[0].groups.x),
        y: Number(match[0].groups.y),
      },
      beacon: {
        x: Number(match[1].groups.x),
        y: Number(match[1].groups.y),
      },
    };
  });

  var maps = {};

  data.forEach((read) => {
    let pos = read.sensor.x + ',' + read.sensor.y;
    maps[pos] = 'S';
    pos = read.beacon.x + ',' + read.beacon.y;
    maps[pos] = 'B';
  });

  var x_max = -Infinity;
  var x_min = Infinity;
  var y_max = -Infinity;
  var y_min = Infinity;

  var count1 = 0;

  data.forEach((read) => {
    const {
      sensor: { x: Sx, y: Sy },
      beacon: { x: Bx, y: By },
    } = read;

    let Dx = Math.abs(Sx - Bx);
    let Dy = Math.abs(Sy - By);
    let D = Dx + Dy;

    x_max = Math.max(x_max, Sx + (Dx + Dy));
    x_min = Math.min(x_min, Sx - (Dx + Dy));

    let x_lim = 0;
    for (let y = Sy - D; y <= Sy + D; y++) {
      for (let x = -x_lim; x <= x_lim; x++) {
        if (y == 2000000) {
          if (maps[pos] == undefined) {
            let pos = Sx + x + ',' + y;
            maps[pos] = '#';
            count1++;
          }
        }
      }
      // if (y == Sy) console.log(`y: ${y}, Sy: ${Sy}, Xlim: ${x_lim}, D: ${D}, Dx: ${Dx}, Dy: ${Dy}`)
      y < Sy ? x_lim++ : x_lim--;
    }
  });

  var line = 2000000;

  var beacon = data.filter((read) => read.beacon.y == line)[0];
  var count = 0;
  for (let i = x_min; i <= x_max; i++) {
    let pos = x_min + i + ',' + line;
    if (maps[pos] == '#') count++;
  }
  console.log(count, count1);
})();
