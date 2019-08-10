import React from 'react'
import { getFirebase } from '../../firebase/firebaseManager'

import MemoryCard from './MemoryCard'

class MemoryList extends React.Component {
    constructor(props) {
        super(props)

        this.db = getFirebase()

        this.state = {
            memoryList: []
        }
    }

    componentDidMount() {
        this.getMemoryFromFirebase()
    }

    getMemoryFromFirebase = () => {

        this.db.collection("memories")
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

    handleClickSave(memory) {
        console.log(memory)
    }

    render() {
        return (
            <div className="align-center">
                {this.state.memoryList.map(m => <MemoryCard key={m.id} memory={m} onClickSave={this.handleClickSave} />)}
            </div>
        )
    }
}

export default MemoryList