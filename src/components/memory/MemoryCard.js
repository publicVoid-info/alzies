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
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme) => (
  {
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary
    },
    card: {
      float: 'left',
      margin: '10px',
    },
    '@media (max-width: 340px)': {
      card: {
        maxWidth: '280px',
      }
    },
    cardHeader: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.secondary.dark,
      '& h3': {
        padding: '0',
        margin: '0',
        textTransform: 'uppercase',
      },
    },
    cardContent: {
      padding: '0px',
      margin: '0px',
    },
    cardAction: {
      padding: '0px',
      margin: '0px',
    },
    deleteButton: {
      marginLeft: 'auto',
      color: theme.palette.text.primary
    },
  }
))

export default function MemoryCard({ memory }) {

  const classes = useStyles()

  const handleDeleteClick = () => () => {

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
    <Card className={classes.card} elevation={8} >
      <CardHeader
        className={classes.cardHeader}
        title={<h3>{memory.headline}</h3>}
        autoCorrect="false"
        disableTypography={true} />

      <Divider variant="fullWidth" />
      <CardContent className={classes.cardContent} autoCorrect="false" >
        <Typography variant="body1" component="div">
          <Editor
            theme="bubble"
            text={memory.content}
            readOnly={true}
          />
        </Typography>
      </CardContent>
      <Divider variant="fullWidth" />
      <CardActions className={classes.cardAction} disableSpacing>
        <IconButton >
          <Link to={`/memory/${memory.id}`} className={classes.link}>
            <EditIcon />
          </Link>
        </IconButton>
        <IconButton className={classes.deleteButton} onClick={handleDeleteClick()}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card >
  )
}