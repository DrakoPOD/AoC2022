var fs = require('fs').promises;

(async () => {
  var raw;
  var data;
  raw = await fs.readFile('./day12/data-12.txt', 'utf8');

  data = raw.split('\r\n').map((x) => x.split(''));
  var start;
  var end;
  for (let i = 0; i < data.length; i++) {
    let e = data[i].indexOf('S');
    if (e > -1) {
      start = [i, e];
    }
    e = data[i].indexOf('E');
    if (e > -1) {
      end = [i, e];
    }
    if (start && end) break;
  }

  class NODE {
    constructor(x, y, value) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.point = value.charCodeAt() - 97;
      this.type = (() => {
        if (value == 'S') {
          this.point = 0;
          return 'start';
        }
        if (value == 'E') {
          this.point = 122 - 97;
          return 'end';
        }
        return 'node';
      })();
      this.h = Math.abs(end[1] - x) + Math.abs(end[0] - y);
      this.prev;
      this.next;
      this.visited = false;

      this.vecinos = [];
    }
    g(vecino) {
      let result = this.point - vecino.point;
      result = result > 1 ? 10000 : result;
      return Math.abs(result);
    }
    enable() {
      return this.vecinos.every((x) => !x.visited);
    }
  }

  function aStar() {
    const xMax = data[0].length;
    const yMax = data.length;

    let maps = Array(yMax)
      .fill(null)
      .map(() => Array(xMax).fill(null));

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    maps[start[0]][start[1]] = new NODE(start[1], start[0], 'S');
    maps[end[0]][end[1]] = new NODE(end[1], end[0], 'E');

    let pos = maps[start[0]][start[1]];

    let nodes = [];
    let a = 0;
    while (true) {
      a++;

      for (let [x2, y2] of directions) {
        let x = pos.x + x2;
        let y = pos.y + y2;

        if (x < 0 || y < 0 || x >= xMax || y >= yMax) continue;

        if (!maps[y][x]) {
          maps[y][x] = new NODE(x, y, data[y][x]);
        }
        const next = maps[y][x];

        pos.vecinos.push(next);
        if (next.visited) continue;

        next.prev = pos;

        const f = pos.g(next) + next.h;
        const z = pos.g(next);
        if (f >= 10000) continue;

        nodes.push([f, next, pos]);
      }

      pos.visited = true;

      // nodes.push(...points)

      nodes = nodes.filter((x) => !x[1].visited);
      if (nodes.length == 0) console.log(pos);
      const temp = nodes.reduce((prev, curr) =>
        prev[0] < curr[0] ? prev : curr
      );
      pos = temp[1];
      pos.prev = temp[2];

      if (pos.type == 'end') break;
    }
    let prev = pos;
    let step = 0;
    while (true) {
      if (prev.type == 'start') break;
      step++;
      prev = prev.prev;
    }
    return step;
  }

  aStar();
})();
