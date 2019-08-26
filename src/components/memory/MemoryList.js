import React from 'react'
import { getFirestore } from '../../helpers/firebaseManager'
import AuthContext from '../../context/authContext'
import RootRef from "@material-ui/core/RootRef"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { List, ListItem, ListItemSecondaryAction } from "@material-ui/core"
import MemoryCard from './MemoryCard'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const getItemStyle = (isDragging, draggableStyle) => ({

    ...draggableStyle,

    ...(isDragging && {
        opacity: '0.7',
    })
})

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : 'lightgrey',
})

class MemoryList extends React.Component {
    constructor(props) {
        super(props)

        this.currentUser = null
        this.unsubscribe = null

        this.state = {
            memoryList: []
        }

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const items = reorder(
            this.state.memoryList,
            result.source.index,
            result.destination.index
        )

        getFirestore().collection('memoryPosition')
            .doc(this.currentUser.uid)
            .set({ memoryId: items.map(item => item.id) })

        this.setState({
            memoryList: items
        })
    }

    getMemories() {

        const userId = (this.currentUser) ? this.currentUser.uid : ''

        this.unsubscribe =
            getFirestore().collection('memories')
                .where('owner', 'array-contains', userId)
                .onSnapshot((qs) => {
                    const result = []

                    qs.forEach(
                        (doc) => result.push({ id: doc.id, ...doc.data() })
                    )

                    getFirestore().collection('memoryPosition')
                        .doc(userId)
                        .get()
                        .then((doc) =>
                            this.sortMemories(result,
                                (doc.exists)
                                    ?
                                    doc.data()
                                    :
                                    { memoryId: [] }
                            )
                        )
                })
    }

    sortMemories(memoryList, posicoes) {

        //caso venha vazio, é primeira vez, inicializa
        if (posicoes.memoryId.length === 0) {
            memoryList.forEach((v, i) => posicoes.memoryId.push(v.id))
        }

        const sortedResult = memoryList.map((m) => {

            const posicaoEncontrada = posicoes.memoryId.findIndex((id) => id === m.id)

            return {
                ...m,
                indexSort:
                    (posicaoEncontrada === -1)
                        ? posicoes.memoryId.length
                        : posicaoEncontrada
            }

        }).sort((a, b) => a.indexSort - b.indexSort)

        this.setState({
            memoryList: sortedResult
        })

    }

    componentDidMount() {

        this.currentUser = this.context
        this.getMemories()

    }

    componentWillUnmount() {

        this.unsubscribe()

    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List style={getListStyle(snapshot.isDraggingOver)}>
                                {this.state.memoryList.map((item, index) => (
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
                                                    history={this.props.history} />

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
            </DragDropContext>
        )
    }
}

MemoryList.contextType = AuthContext

export default MemoryList