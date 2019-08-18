import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getFirestore, getFirebaseAuth } from '../../firebaseManager'
import uuidv4 from 'uuid/v4'
import Editor from '../quill/Editor'

import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Header from '../Header'
import Snackbar from '../dialogs/Snackbar'
import Fab from '../buttons/FloatingActionButton'
import SaveIcon from '@material-ui/icons/Done'

const useStyles = makeStyles(theme => ({
    card: {
        width: '95%',
        height: '85vh',
        margin: '10px',
        padding: '10px',
    },
    cardContent: {
        overflow: 'auto',
        height: '100%',
    },
    cardActions: {
        position: 'absolute',
        bottom: 25,
    },
    textField: {
        margin: 'auto',
        width: '95%',
        padding: '10px',
    },
}))

export default function MemoryEdit(props) {

    const classes = useStyles()

    const [memory, setMemory] = React.useState({ owner: [], id: '', headline: '', content: '' })
    const [editorText, setEditorText] = React.useState('')
    const [message, setMessage] = React.useState('')

    const userId = (getFirebaseAuth().currentUser) ? getFirebaseAuth().currentUser.uid : ''

    const getMemory = (id) => {

        const docRef = getFirestore().collection('memories').doc(id)

        docRef.get().then(function (doc) {
            if (doc.exists) {
                setMemory({ id: doc.id, ...doc.data() })
                setEditorText(doc.data().content)
            }
        }).catch(function (error) {
            setMessage(`Error getting document:, ${error}`);
        });
    }

    useEffect(() => {
        if (!props.match.params.id !== 'add') {
            getMemory(props.match.params.id)
        }
    }, [props.match.params.id])

    const handleChange = name => event => {

        setMemory({ ...memory, [name]: event.target.value })
    }

    const handleChangeEditor = () => text => {
        setEditorText(text)
        setMemory({ ...memory, content: text })
    }

    const handleClickSave = () => () => {

        if (memory.id === '') { memory.id = uuidv4() }
        if (memory.owner.length === 0) { memory.owner.push(userId) }

        getFirestore().collection('memories').doc(memory.id).set(memory)
            .then(function () {
                props.history.push('/home')
            })
            .catch(function (error) {
                setMessage('Error writing document: ', error)
            })
    }

    return (
        <nav >
            <Header />
            <main>
                <Container maxWidth="xl">
                    <Card className={classes.card} elevation={4} >
                        <TextField
                            id="standard-name"
                            label="Headline"
                            className={classes.textField}
                            value={memory.headline}
                            onChange={handleChange('headline')}
                            required
                        />
                        <CardContent className={classes.cardContent} autoCorrect="false" >
                            <Typography variant="body1" color="textSecondary" component="div">
                                <Editor
                                    theme="snow"
                                    onChange={handleChangeEditor()}
                                    text={editorText}
                                    readOnly={false} />
                            </Typography>
                        </CardContent>
                    </Card>
                    {
                        message && <Snackbar message={message} />
                    }
                </Container>
                <Fab onClick={handleClickSave}
                    color="secondary"
                    label="Edit">
                    <SaveIcon />
                </Fab>
            </main>
        </nav>
    )
}