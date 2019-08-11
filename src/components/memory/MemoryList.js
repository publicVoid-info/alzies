import React from 'react'
import { getFirebase } from '../../firebaseManager'

import MemoryCard from './MemoryCard'
import Container from '@material-ui/core/Container'

class MemoryList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            memoryList: []
        }
    }

    getMemories() {

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

    render() {
        return (
            <Container fixed={true}>
                <div>
                    {this.state.memoryList.map(m => <MemoryCard key={m.id} memory={m} />)}
                </div>
            </Container>
        )
    }
}

export default MemoryList