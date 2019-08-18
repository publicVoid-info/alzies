import React from 'react'
import { getFirestore, getFirebaseAuth } from '../../firebaseManager'

import MemoryCard from './MemoryCard'

class MemoryList extends React.Component {
    constructor(props) {
        super(props)

        this.unsubscribe = null

        this.state = {
            memoryList: []
        }
    }

    getMemories() {

        const userId = (getFirebaseAuth().currentUser) ? getFirebaseAuth().currentUser.uid : ''

        this.unsubscribe =
            getFirestore().collection('memories')
                .where('owner', 'array-contains', userId)
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
            <React.Fragment>
                {this.state.memoryList.map(m => <MemoryCard key={m.id} memory={m} />)}
            </React.Fragment>
        )
    }
}

export default MemoryList