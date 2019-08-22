import React from 'react'
import { getFirestore } from '../../helpers/firebaseManager'
import AuthContext from '../../context/authContext'

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

        const currentUser = this.context

        const userId = (currentUser) ? currentUser.uid : ''

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
                {this.state.memoryList.map(m =>
                    <MemoryCard
                        key={m.id}
                        memory={m}
                        history={this.props.history} />
                )}
            </React.Fragment>
        )
    }
}

MemoryList.contextType = AuthContext

export default MemoryList