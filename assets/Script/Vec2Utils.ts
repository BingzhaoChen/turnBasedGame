
export default class Vec2Utils{
    static getDistance(s: {x, y}, t: {x, y}) {
        let dx = t.x - s.x;
        let dy = t.y - s.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}