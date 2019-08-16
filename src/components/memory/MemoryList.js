import React from 'react'
import { getFirebase } from '../../firebaseManager'

import MemoryCard from './MemoryCard'
import Container from '@material-ui/core/Container'

class MemoryList extends React.Component {
    constructor(props) {
        super(props)

        this.unsubscribe = null

        this.state = {
            memoryList: []
        }
    }

    getMemories() {

        this.unsubscribe =
            getFirebase().collection('memories')
                .onSnapshot((qs) => {
                    const result = []
                    qs.forEach(
                        (doc) => {
                            result.push({ id: doc.id, ...doc.data() })
                        }
                    )

                    this.setState({
                        memoryList: result
                    })
                })
    }

    componentDidMount() {

        this.getMemories()

    }

    componentWillUnmount() {

        this.unsubscribe()

    }

    render() {
        return (
            <Container maxWidth="xl">
                {this.state.memoryList.map(m => <MemoryCard key={m.id} memory={m} />)}
            </Container>
        )
    }
}

export default MemoryList