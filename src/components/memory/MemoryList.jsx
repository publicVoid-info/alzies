import React from 'react';
import PropTypes from 'prop-types';
import RootRef from '@material-ui/core/RootRef';
import { List, ListItem } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import MemoryCard from './MemoryCard';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({

    ...draggableStyle,

    ...(isDragging && {
        opacity: '0.7',
    })
});

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

class MemoryList extends React.Component {
    constructor(props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.props.memoryList,
            result.source.index,
            result.destination.index
        );

        this.props.onUpdateList(items);
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List style={getListStyle(snapshot.isDraggingOver)}>
                                {this.props.memoryList.map((item) => (
                                    <Draggable key={item.id} draggableId={item.id} index={item.indexSort}>
                                        {(provided, snapshot) => (
                                            <ListItem
                                                ContainerComponent="div"
                                                ContainerProps={{ ref: provided.innerRef }}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <MemoryCard
                                                    key={item.id}
                                                    memory={item}
                                                />

                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </RootRef>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

MemoryList.propTypes = {
    classes: PropTypes.object.isRequired,
    memoryList: PropTypes.array.isRequired,
    onUpdateList: PropTypes.func.isRequired,
};

export default MemoryList;