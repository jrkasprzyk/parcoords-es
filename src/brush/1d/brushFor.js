import { brushY, brushSelection } from 'd3-brush';
import invertByScale from '../invertByScale';
import selected from './selected';

const brushUpdated = (config, pc, events, args) => newSelection => {
  config.brushed = newSelection;
  events.call('brush', pc, config.brushed, args);
  pc.renderBrushed();
};

const brushFor = (state, config, pc, events, brushGroup) => (
  axis,
  _selector
) => {
  // handle hidden axes which will not be a property of dimensions
  if (!config.dimensions.hasOwnProperty(axis)) {
    return () => {};
  }

  const brushRangeMax =
    config.dimensions[axis].type === 'string'
      ? config.dimensions[axis].yscale.range()[
          config.dimensions[axis].yscale.range().length - 1
        ]
      : config.dimensions[axis].yscale.range()[0];

  const _brush = brushY(_selector).extent([[-15, 0], [15, brushRangeMax]]);

  // d3 v6+ invokes listeners as (event, datum); the v5 (datum, index, nodes)
  // layout this used to slice out of `arguments` no longer exists. The axis name
  // is already in scope above, and the node is the listener's `this`.
  const convertBrushArguments = node => {
    const raw = brushSelection(node) || [];

    // handle hidden axes which will not have a yscale
    let yscale = null;
    if (config.dimensions.hasOwnProperty(axis)) {
      yscale = config.dimensions[axis].yscale;
    }

    // ordinal scales do not have invert
    const scaled = invertByScale(raw, yscale);

    return {
      axis,
      node,
      selection: {
        raw,
        scaled,
      },
    };
  };

  _brush
    .on('start', function(event) {
      // d3 v6+ leaves sourceEvent undefined for a programmatic brush.move,
      // where v5 set it to null; `!=` catches both.
      if (event.sourceEvent != null) {
        events.call(
          'brushstart',
          pc,
          config.brushed,
          convertBrushArguments(this)
        );
        if (typeof event.sourceEvent.stopPropagation === 'function') {
          event.sourceEvent.stopPropagation();
        }
      }
    })
    .on('brush', function() {
      brushUpdated(
        config,
        pc,
        events,
        convertBrushArguments(this)
      )(selected(state, config, brushGroup)());
    })
    .on('end', function() {
      brushUpdated(config, pc, events)(selected(state, config, brushGroup)());
      events.call(
        'brushend',
        pc,
        config.brushed,
        convertBrushArguments(this)
      );
    });

  state.brushes[axis] = _brush;
  state.brushNodes[axis] = _selector.node();

  return _brush;
};

export default brushFor;
