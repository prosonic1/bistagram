import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const itemTarget = {
  hover(props, monitor, component) {
    const lastX = monitor.getItem().index;
    const nextX = props.index;
    // Don't replace items with themselves
    if (lastX === nextX) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (lastX < nextX && hoverClientY < hoverMiddleY) {
      return;
    }
    // Dragging upwards
    if (lastX > nextX && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    props.handleDragMedia(lastX, nextX);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = nextX;
  },
};

@DropTarget('media', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('media', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))

class Dragitem extends Component {
    render() {
      const { media, media_url, connectDragSource, connectDropTarget, handleDeleteMedia, index} = this.props;
      return connectDragSource(connectDropTarget(
        <div className="draggable_img">
          {media.type.match("image") ?
            <img src={media_url} className="img_100" alt=""></img>:
            <video src={media_url} className="img_100" alt=""></video>
          }
          <button type="button" className="draggable_delbtn" onClick={(e)=>handleDeleteMedia(index)}></button>
          {media.type.match("video")&&
          <button type="button" className="imgs draggable_playbtn"></button>
          }
        </div>
      ));
    }
}

export default Dragitem;
