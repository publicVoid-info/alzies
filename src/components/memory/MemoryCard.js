import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { getFirebase } from '../../firebaseManager'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import Editor from '../quill/Editor'
import DeleteIcon from '@material-ui/icons/Delete'
import Snackbar from '../dialogs/Snackbar'

const useStyles = makeStyles((theme) => (
  {
    link: {
      textDecoration: 'none',
      color: theme.palette.text.secondary
    },
    card: {
      margin: '10px',
      minWidth: '300px',
      float: 'left',
    },
    cardHeader: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.main
    },
    deleteButton: {
      marginLeft: 'auto',
    },
  }
))

export default function MemoryCard({ memory }) {

  const classes = useStyles()

  //const [message, setMessage] = React.useState('')
  const message = ''

  const handleDeleteClick = (memory) => () => {

    if (!memory.id) { return }

    getFirebase().collection('memories').doc(memory.id).delete()
      .then(function () {
        //setMessage('Document deleted!')
      })
      .catch(function (error) {
        //setMessage('Error deleting document: ', error)
      })
  }

  return (
    <Card className={classes.card} elevation={4} >
      <CardHeader className={classes.cardHeader} title={memory.headline} autoCorrect="false" />
      <CardContent autoCorrect="false" >
        <Typography variant="body1" color="textSecondary" component="div">
          <Editor
            theme="bubble"
            text={memory.content}
            readOnly={true} />
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton >
          <Link to={`/memory/${memory.id}`} className={classes.link}>
            <EditIcon />
          </Link>
        </IconButton>
        <IconButton className={classes.deleteButton} onClick={handleDeleteClick(memory)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
      {message && <Snackbar message={message} />}
    </Card >
  )
}