import React from 'react'
import { getFirebase } from '../../firebase/firebaseManager'

import MemoryCard from './MemoryCard'

class MemoryList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            memoryList: []
        }
    }

    getMemories() {

        getFirebase().collection('memories')
            .get()
            .then((qs) => {
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
            <div className="align-center">
                {this.state.memoryList.map(m => <MemoryCard key={m.id} memory={m} />)}
            </div>
        )
    }
}

export default MemoryList