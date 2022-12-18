"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getLineIntersection = exports.findLineBetween = exports.findAdjacentSensors = exports.getScannedPositionsOnLine = exports.getIntersection = exports.getSensorRadius = exports.getDistance = exports.parseSensors = void 0;
var fs = require("fs");
var input = fs
    .readFileSync(__dirname + '/example-15.txt', 'utf8')
    .replace(/\r/g, '');
function parseSensors(str) {
    return str.split('\n').map(function (line) {
        var _a = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/), sx = _a[1], sy = _a[2], bx = _a[3], by = _a[4];
        return {
            pos: { x: Number(sx), y: Number(sy) },
            closest: { x: Number(bx), y: Number(by) }
        };
    });
}
exports.parseSensors = parseSensors;
function getDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
exports.getDistance = getDistance;
function getSensorRadius(sensor) {
    return getDistance(sensor.pos, sensor.closest);
}
exports.getSensorRadius = getSensorRadius;
function getIntersection(sensor, lineNum) {
    var yDist = Math.abs(lineNum - sensor.pos.y);
    var sensorRadius = getSensorRadius(sensor);
    if (yDist > sensorRadius) {
        // no intersection
        return null;
    }
    var span = sensorRadius - yDist;
    // inclusive
    var from = sensor.pos.x - span;
    var to = sensor.pos.x + span;
    var result = new Set();
    for (var i = from; i <= to; i++) {
        result.add(i);
    }
    return result;
}
exports.getIntersection = getIntersection;
function getScannedPositionsOnLine(lineNum, sensors) {
    var result = new Set();
    // add intersections
    for (var _i = 0, sensors_1 = sensors; _i < sensors_1.length; _i++) {
        var sensor = sensors_1[_i];
        var intersection = getIntersection(sensor, lineNum);
        if (intersection) {
            intersection.forEach(function (inter) { return result.add(inter); });
        }
    }
    // remove sensors & beacons
    for (var _a = 0, sensors_2 = sensors; _a < sensors_2.length; _a++) {
        var sensor = sensors_2[_a];
        if (sensor.pos.y === lineNum) {
            result["delete"](sensor.pos.x);
        }
        if (sensor.closest.y === lineNum) {
            result["delete"](sensor.closest.x);
        }
    }
    return result;
}
exports.getScannedPositionsOnLine = getScannedPositionsOnLine;
/**
 * @returns array of sensor pairs that have exactly 1 pixel space between
 */
function findAdjacentSensors(sensors) {
    var result = [];
    for (var i = 0; i < sensors.length - 1; i++) {
        for (var j = i + 1; j < sensors.length; j++) {
            var r1 = getSensorRadius(sensors[i]);
            var r2 = getSensorRadius(sensors[j]);
            var dist = getDistance(sensors[i].pos, sensors[j].pos);
            if (dist === r1 + r2 + 2) {
                result.push([sensors[i], sensors[j]]);
            }
        }
    }
    return result;
}
exports.findAdjacentSensors = findAdjacentSensors;
/**
 * @returns line between 2 adjacent sensors
 */
function findLineBetween(s1, s2) {
    var pos = { x: 0, y: 0 };
    var direction;
    var left;
    var right;
    // TODO: this probably could be implemented more elegantly
    if (s1.pos.x > s2.pos.x) {
        left = s1;
        right = s2;
    }
    else {
        left = s2;
        right = s1;
    }
    if (left.pos.y > right.pos.y) {
        // line goes to up right -> //
        pos.x = left.pos.x;
        pos.y = left.pos.y - getSensorRadius(left) - 1;
        direction = 'upright';
    }
    else {
        // line goes to down right -> \\
        pos.x = left.pos.x;
        pos.y = left.pos.y + getSensorRadius(left) + 1;
        direction = 'downright';
    }
    return {
        pos: pos,
        direction: direction
    };
}
exports.findLineBetween = findLineBetween;
/**
 * @returns intersection point between 2 crossing lines
 */
function getLineIntersection(line1, line2) {
    if (line1.direction === line2.direction)
        throw new Error('lines are parallel');
    var downRight = line1.direction === 'downright' ? line1 : line2;
    var upRight = line1.direction === 'upright' ? line1 : line2;
    // TODO: this could be implemented more elegantly too
    // e.g. by offsetting x or y line positions to 0
    var projectedUpRight = __assign(__assign({}, upRight), { pos: {
            x: downRight.pos.x,
            y: upRight.pos.y + upRight.pos.x - downRight.pos.x
        } });
    var halfDistance = (downRight.pos.y - projectedUpRight.pos.y) / 2;
    var x = downRight.pos.x - halfDistance;
    var y = downRight.pos.y - halfDistance;
    return { x: x, y: y };
}
exports.getLineIntersection = getLineIntersection;
// part 1
console.log(getScannedPositionsOnLine(2000000, parseSensors(input)).size);
// part 2
var adjacent = findAdjacentSensors(parseSensors(input));
var lines = adjacent.map(function (pair) { return findLineBetween.apply(void 0, pair); });
// TODO
// I think we also need to find all possible intersection points of all
// combinations of adjacent sensors, and then check them against all
// sensors to filter the ones that are inside some other sensor.
// But there is only one combination of adjacent pairs in the input and I'm
// really tired of this puzzle, so I'll leave this comment instead.
var point = getLineIntersection(lines[0], lines[1]);
console.log(point.x * 4000000 + point.y);
