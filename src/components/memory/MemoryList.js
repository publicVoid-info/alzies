import React from 'react'
import MemoryCard from './MemoryCard'
import { getFirebase } from '../../firebase/FirebaseProvider'

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
            .then((querySnapshot) => {
                const result = []
                querySnapshot.forEach(
                    (doc) => {
                        result.push({ id: doc.id, ...doc.data() })
                    }
                )
                this.setState({
                    memoryList: result
                })
            })
    }

    render() {
        return (
            < React.Fragment >
                {this.state.memoryList.map(m => <MemoryCard key={m.id} memory={m} />)}
            </React.Fragment >
        )
    }
}

export default MemoryList