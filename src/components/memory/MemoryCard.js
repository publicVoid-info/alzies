import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getFirestore } from '../../helpers/firebaseManager'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import Editor from '../quill/Editor'
import Divider from '@material-ui/core/Divider'
import DeleteCardDialog from '../dialogs/DeleteCardDialog'
import FindUserDialog from '../dialogs/FindUsersDialog'
import AuthContext from '../../context/authContext';

const useStyles = makeStyles((theme) => (
  {
    card: {
      float: 'left',
      margin: '10px',
      minWidth: '280px',
      textAlign: 'left',
      overflow: 'auto',
      width: '100%',
      height: '100%',
    },
    '@media (max-width: 340px)': {
      card: {
        maxWidth: '260px',
      },
    },
    cardHeader: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.secondary.main,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
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
    actionButtonRight: {
      marginLeft: 'auto',
    },
  }
))

function MemoryCard(props) {

  const { memory, history } = props
  const classes = useStyles()
  const currentUser = useContext(AuthContext)


  const handleDeleteClick = () => {

    if (!memory.id) { return }

    getFirestore().collection('memoryPosition').doc(currentUser.uid).delete()
    getFirestore().collection('memories').doc(memory.id).delete()
  }

  const handleSelectUser = (user) => {

    if (memory.owner.indexOf(user.uid) === -1) {

      const newMemory = {
        ...memory,
        owner: [...memory.owner, user.uid]
      }

      getFirestore().collection('memories').doc(memory.id).set(newMemory)
    }
  }

  const handleMemoryEdit = () => {
    history.push(`/memory/${memory.id}`)
  }

  return (
    <Card
      className={classes.card}
      elevation={8}
      onDoubleClick={handleMemoryEdit}
      draggable={true}>
      <CardHeader
        className={classes.cardHeader}
        title={<h3>{memory.headline}</h3>}
        autoCorrect="false"
        disableTypography={true} />

      <Divider variant="fullWidth" />
      <CardContent className={classes.cardContent} autoCorrect="false" >
        <Typography variant="body1" component="div">
          <Editor
            height="auto"
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
        <div className={classes.actionButtonRight}>
          <DeleteCardDialog
            className={classes.actionButton}
            onDelete={handleDeleteClick} />
          <FindUserDialog
            className={classes.actionButton}
            onSelectUser={handleSelectUser} />
        </div>
      </CardActions>
    </Card >
  )
}

export default MemoryCard