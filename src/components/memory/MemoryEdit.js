import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getFirebase } from '../../firebaseManager'
import uuidv4 from 'uuid/v4'
import Editor from '../quill/Editor'

import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Check'
import TextField from '@material-ui/core/TextField'
import Header from '../Header'
import Snackbar from '../dialogs/Snackbar'


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

    const [memory, setMemory] = React.useState({ id: '', headline: '', content: '' })
    const [editorText, setEditorText] = React.useState('')
    const [message, setMessage] = React.useState('')

    const getMemory = (id) => {

        const docRef = getFirebase().collection('memories').doc(id)

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

    const handleClickSave = (memory) => () => {

        if (memory.id === '') {
            memory.id = uuidv4()
        }

        getFirebase().collection('memories').doc(memory.id).set(memory)
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
                        <CardActions className={classes.cardActions} disableSpacing>
                            <IconButton onClick={handleClickSave(memory)}>
                                <SaveIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                    {
                        message && <Snackbar message={message} />
                    }
                </Container>
            </main>
        </nav>
    )
}