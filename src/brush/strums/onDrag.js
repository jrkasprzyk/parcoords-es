import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import onDragEnd from './onDragEnd';

const drawStrum = (
  brushGroup,
  state,
  config,
  pc,
  events,
  strum,
  activePoint
) => {
  let _svg = pc.selection.select('svg').select('g#strums'),
    id = strum.dims.i,
    points = [strum.p1, strum.p2],
    _line = _svg.selectAll('line#strum-' + id).data([strum]),
    circles = _svg.selectAll('circle#strum-' + id).data(points),
    _drag = drag();

  _line
    .enter()
    .append('line')
    .attr('id', 'strum-' + id)
    .attr('class', 'strum');

  _line
    .attr('x1', d => d.p1[0])
    .attr('y1', d => d.p1[1])
    .attr('x2', d => d.p2[0])
    .attr('y2', d => d.p2[1])
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  _drag
    .on('drag', function(event, d) {
      const i = points.indexOf(d) + 1;
      strum['p' + i][0] = Math.min(Math.max(strum.minX + 1, event.x), strum.maxX);
      strum['p' + i][1] = Math.min(Math.max(strum.minY, event.y), strum.maxY);
      drawStrum(brushGroup, state, config, pc, events, strum, i - 1);
    })
    .on('end', onDragEnd(brushGroup, state, config, pc, events));

  circles
    .enter()
    .append('circle')
    .attr('id', 'strum-' + id)
    .attr('class', 'strum');

  circles
    .attr('cx', d => d[0])
    .attr('cy', d => d[1])
    .attr('r', 5)
    .style(
      'opacity',
      (d, i) => (activePoint !== undefined && i === activePoint ? 0.8 : 0)
    )
    .on('mouseover', function() {
      select(this).style('opacity', 0.8);
    })
    .on('mouseout', function() {
      select(this).style('opacity', 0);
    })
    .call(_drag);
};

const onDrag = (brushGroup, state, config, pc, events) => (event) => {
  const strum = state.strums[state.strums.active];

  // Make sure that the point is within the bounds
  strum.p2[0] = Math.min(
    Math.max(strum.minX + 1, event.x - config.margin.left),
    strum.maxX
  );
  strum.p2[1] = Math.min(
    Math.max(strum.minY, event.y - config.margin.top),
    strum.maxY
  );

  drawStrum(brushGroup, state, config, pc, events, strum, 1);
};

export default onDrag;
