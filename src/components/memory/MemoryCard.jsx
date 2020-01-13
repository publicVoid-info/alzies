import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getFirestore } from '../../helpers/firebase';
import { withRouter } from 'react-router-dom';
import { openSnackbar } from '../../store/actions';

import Editor from '../editor/Editor';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
import ArrowDrop from '@material-ui/icons/ArrowDropDownCircleOutlined';

import FindUsersDialog from '../../dialogs/FindUsersDialog';

const useStyles = makeStyles((theme) => (
  {
    card: {
      minWidth: '280px',
      overflow: 'none',
      width: '100%',
      height: '100%',
      marginTop: theme.spacing(1),
    },
    '@media (max-width: 340px)': {
      card: {
        maxWidth: '260px',
      },
    },
    cardHeader: {
      cursor: 'pointer',
      '& h5': {
        padding: '0',
        margin: '0',
        textAlign: 'center',
      },
      '&:focus': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    cardActionButton: {
      padding: '5px',
      margin: '5px',
    },
    cardActionIcon: {
      padding: '0px',
      margin: '0px',
    },
  }
))

function MemoryCard(props) {

  const { memory, user } = props;
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  const [findUsersOpen, setFindUsersOpen] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  }

  const handleSendTrashClick = () => {

    if (!memory.id) { return }

    getFirestore().collection('memoryPosition')
      .doc(user.uid)
      .delete();

    getFirestore().collection('memories')
      .doc(memory.id)
      .delete()
      .then(() => {
        return getFirestore().collection('archivedMemories')
          .doc(memory.id)
          .set(memory)
      })
      .then(() => props.openSnackbar('Card moved to trash'))
      .catch(error => props.openSnackbar(error));
  }

  const handleRestoreTrashClick = () => {

    if (!memory.id) { return }

    getFirestore().collection('archivedMemoryPosition')
      .doc(user.uid)
      .delete();

    getFirestore().collection('archivedMemories')
      .doc(memory.id)
      .delete()
      .then(() => {
        return getFirestore().collection('memories')
          .doc(memory.id)
          .set(memory)
      })
      .then(() => props.openSnackbar('Card restored from trash'))
      .catch(error => props.openSnackbar(error));
  }

  const handleDeleteTrashClick = () => {

    if (!memory.id) { return }

    getFirestore().collection('archivedMemoryPosition')
      .doc(user.uid)
      .delete();

    getFirestore().collection('archivedMemories')
      .doc(memory.id)
      .delete()
      .then(() => props.openSnackbar('Card deleted'))
      .catch(error => props.openSnackbar(error));
  }

  const handleShareClick = () => {
    setFindUsersOpen(true);
  }

  const handleCloseFindUsers = () => {
    setFindUsersOpen(false);
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
    setFindUsersOpen(false);
  }

  const handleMemoryEdit = () => {
    props.history.push(`/memory/${memory.id}`);
  }

  return (
    <Card
      className={classes.card}
      elevation={8}
      onDoubleClick={(!props.activeTable.trash) ? handleMemoryEdit : null}
      draggable={true}>

      <CardHeader
        component="div"
        className={classes.cardHeader}
        title={memory.headline}
        autoCorrect="false"
        disableTypography={false}
        titleTypographyProps={
          {
            align: 'center',
            overflow: 'auto',
            variant: 'h6',
            color: 'textPrimary',
          }}
        onClick={toggleExpand}
        action={(!props.activeTable.trash) &&
          <IconButton className={classes.menuVert} onClick={toggleExpand}>
            <ArrowDrop />
          </IconButton>
        }
      />

      <Collapse in={expanded}>
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

        {(!props.activeTable.trash)
          ?
          <CardActions className={classes.cardActionIcon}>
            <IconButton onClick={handleMemoryEdit}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={handleSendTrashClick} style={{ marginLeft: 'auto', marginRight: '0' }}>
              <DeleteIcon />
            </IconButton>

            <IconButton onClick={handleShareClick} style={{ marginLeft: '0', marginRight: '0' }}>
              <ShareIcon />
            </IconButton>
          </CardActions>
          :
          <CardActions className={classes.cardActionButton}>
            <Button variant="contained" color="primary" onClick={handleRestoreTrashClick}>Restore</Button>
            <Button variant="outlined" color="primary" onClick={handleDeleteTrashClick}>Delete</Button>
          </CardActions>
        }
        <FindUsersDialog
          open={findUsersOpen}
          onClose={handleCloseFindUsers}
          onSelectUser={handleSelectUser} />
      </Collapse>

    </Card >
  )
}

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, { openSnackbar })(withRouter(MemoryCard));