import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { getFirebase } from '../../firebaseManager'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import Editor from '../quill/Editor'
import Divider from '@material-ui/core/Divider'
import DeleteCardDialog from '../dialogs/DeleteCardDialog';

const useStyles = makeStyles((theme) => (
  {
    card: {
      float: 'left',
      margin: '10px',
      minWidth: '280px',
    },
    '@media (max-width: 340px)': {
      card: {
        maxWidth: '280px',
      }
    },
    cardHeader: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.secondary.main,
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
    },
  }
))

function MemoryCard(props) {

  const { memory, history } = props

  const classes = useStyles()

  const handleDeleteClick = () => {

    if (!memory.id) { return }

    getFirebase().collection('memories').doc(memory.id).delete()
  }

  const handleMemoryEdit = () => {
    history.push(`/memory/${memory.id}`)
  }

  return (
    <Card className={classes.card} elevation={8} onDoubleClick={handleMemoryEdit}>
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
      <CardActions className={classes.cardAction} disableSpacing >
        <IconButton onClick={handleMemoryEdit}>
          <EditIcon />
        </IconButton>
        <DeleteCardDialog className={classes.deleteButton}
          handleDelete={handleDeleteClick}>
        </DeleteCardDialog>
      </CardActions>
    </Card >
  )
}

export default withRouter(MemoryCard)

