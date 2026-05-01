import { min } from 'd3-array';

//draw dots with radius r on the axis line where data intersects
const axisDots = (config, pc, position) => _r => {
  const r = _r || 0.1;
  const ctx = pc.ctx.dots;
  const startAngle = 0;
  const endAngle = 2 * Math.PI;
  ctx.globalAlpha = min([1 / Math.pow(config.data.length, 1 / 2), 1]);
  config.data.forEach(d => {
    Object.entries(config.dimensions).forEach(([key], i) => {
      ctx.beginPath();
      ctx.arc(
        position(key),
        config.dimensions[key].yscale(d[key]),
        r,
        startAngle,
        endAngle
      );
      ctx.stroke();
      ctx.fill();
    });
  });
  return this;
};

export default axisDots;
