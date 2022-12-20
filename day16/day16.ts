const __dirname = new URL('.', import.meta.url).pathname;

let raw: Uint8Array | string = await Deno.readFile('./day16/example-16.txt');

raw = new TextDecoder().decode(raw);

const data = raw.split('\r\n').map((line) => {
  const [, valve, rate, tunnels] =
    line.match(
      /Valve (-?\w+) has flow rate=(-?\d+); tunnel\w? lead\w? to valve\w? (.+)/
    ) || [];

  return { valve, rate: Number(rate), tunnels: tunnels.split(', ') };
});

const valves: {
  [key: string]: {
    rate: number;
    tunnels: string[];
    open: boolean;
    minute: number;
  };
} = {};

data.forEach(({ valve, rate, tunnels }) => {
  valves[valve] = {
    rate,
    tunnels,
    open: false,
    minute: 0,
  };
});

const sequence = new Set<string>();

data
  .filter((x) => x.rate > 0)
  .sort((a, b) => b.rate - a.rate)
  .forEach((x) => sequence.add(x.valve));

class Tunnel {
  name: string;
  rate: number[];
  time: number[];
  paths: string[];
  merged: boolean;

  constructor(name: string, rate: number, paths: string[]) {
    this.name = name;
    this.rate = [rate];
    this.time = [];
    this.paths = paths;
    this.merged = false;
  }
  check() {}
  merge() {}
}
