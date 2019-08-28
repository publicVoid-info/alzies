import React from 'react';
import PropTypes from 'prop-types';
import RootRef from '@material-ui/core/RootRef';
import { List, ListItem, ListItemSecondaryAction } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import readingTime from 'reading-time';

import Snackbar from '@material-ui/core/Snackbar'
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

        this.state = {
            snackbar: {
                autoHideDuration: 0,
                message: '',
                open: false
            }
        }
    }

    openSnackbar = (message) => {
        this.setState({
            snackbar: {
                autoHideDuration: readingTime(message).time * 2,
                message,
                open: true
            }
        });
    };

    closeSnackbar = (clearMessage = false) => {
        const { snackbar } = this.state;

        this.setState({
            snackbar: {
                message: clearMessage ? '' : snackbar.message,
                open: false
            }
        });
    };

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
                                                    openSnackbar={this.openSnackbar}
                                                />
                                                <ListItemSecondaryAction />
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </RootRef>
                    )}
                </Droppable>
                <Snackbar
                    autoHideDuration={this.state.snackbar.autoHideDuration}
                    message={this.state.snackbar.message}
                    open={this.state.snackbar.open}
                    onClose={this.closeSnackbar}
                />
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