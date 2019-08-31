import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getFirestore } from '../../helpers/firebase';
import { AuthContext } from '../../store/store';
import { withRouter } from 'react-router-dom';

import InputDialog from '../../dialogs/InputDialog';
import FindUserDialog from '../../dialogs/FindUsersDialog';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Editor from '../editor/Editor';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => (
  {
    card: {
      minWidth: '280px',
      overflow: 'auto',
      width: '100%',
      height: '100%',
      marginLeft: '10px',
      marginTop: '10px',
    },
    '@media (max-width: 340px)': {
      card: {
        maxWidth: '260px',
      },
    },
    cardHeader: {
      cursor: 'pointer',
      '& h3': {
        padding: '0',
        margin: '0',
        textTransform: 'uppercase',
      },
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
      '&:focus': {
        backgroundColor: theme.palette.secondary.light,
      },
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

  const { memory } = props;
  const classes = useStyles();

  const initialState = {
    deleteCardDialog: {
      open: false,
    },
  };

  const [state, setState] = useState(initialState)
  const user = useContext(AuthContext)

  const openDeleteCardDialog = () => {
    setState({
      ...state,
      deleteCardDialog: {
        open: true
      }
    });
  };

  const closeDeleteCardDialog = () => {
    setState({
      ...state,
      deleteCardDialog: {
        open: false
      },
    });
  };

  const handleDeleteClick = () => {

    if (!memory.id) { return }

    getFirestore().collection('memoryPosition').doc(user.uid).delete()
    getFirestore().collection('memories')
      .doc(memory.id)
      .delete()
      .then((res) => {
        props.openSnackbar('Card deleted')
        closeDeleteCardDialog();
      })
      .catch(error => props.openSnackbar(error));
  }

  const handleSelectUser = (user) => {

    if (memory.owner.indexOf(user.uid) === -1) {

      const newMemory = {
        ...memory,
        owner: [...memory.owner, user.uid]
      }

      getFirestore().collection('memories')
        .doc(memory.id)
        .set(newMemory)
        .then(() => props.openSnackbar('Card shared'))
        .catch(error => props.openSnackbar(error));
    }
  }

  const handleMemoryEdit = () => {
    props.history.push(`/memory/${memory.id}`)
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
          <IconButton onClick={openDeleteCardDialog}>
            <DeleteIcon />
          </IconButton>
          <InputDialog
            open={state.deleteCardDialog.open}

            title="Delete card"
            contentText="This action cannot be reversed."
            okText="Ok"

            onClose={closeDeleteCardDialog}
            onCancelClick={closeDeleteCardDialog}
            onOkClick={handleDeleteClick}
          />
          <FindUserDialog
            className={classes.actionButton}
            onSelectUser={handleSelectUser} />
        </div>
      </CardActions>
    </Card >
  )
}

export default withRouter(MemoryCard);