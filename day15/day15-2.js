(async () => {
  var fs = require('fs').promises;

  var raw = await fs.readFile('./day15/data-15.txt', 'utf8');

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

  // const line = 10;
  const line = 2000000;

  var row = data.map((read) => {
    const {
      sensor: { x: Sx, y: Sy },
      beacon: { x: Bx, y: By },
    } = read;

    const Dx = Math.abs(Sx - Bx);
    const Dy = Math.abs(Sy - By);
    const D = Dx + Dy;

    const diff = Math.abs(Sy - line);
    if (diff > D) {
      return null;
    }
    const min = Sx - (D - diff);
    const max = Sx + (D - diff);

    return [min, max];
  });

  row = row.filter((x) => x).sort((a, b) => a[0] - b[0]);

  var sections = [];

  for (let i = 0; i < row.length; i++) {
    const [x1, x2] = row[i];

    let notIn = true;
    for (let j = 0; j < sections.length; j++) {
      const [k1, k2] = sections[j];

      if (x1 >= k1 && x1 <= k2) {
        notIn = false;
        sections[j][1] = Math.max(k2, x2);
        break;
      }
    }
    if (notIn) {
      sections.push([x1, x2]);
    }
  }

  var count = 0;
  sections.forEach((x) => {
    count = count + x[1] - x[0];
  });

  var sensor = data.filter((read) => read.sensor.y == line).length;
  var beacon = data.filter((read) => read.beacon.y == line).length;

  count = count;

  console.log(`Respuesta 1: ${count}`);
})();
