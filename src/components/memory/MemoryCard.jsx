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
// import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
// import TagIcon from '@material-ui/icons/BookmarkBorder';

import FindUsersDialog from '../../dialogs/FindUsersDialog';

const useStyles = makeStyles((theme) => (
  {
    card: {
      minWidth: '280px',
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
      cursor: 'pointer',
      '& h3': {
        padding: '0',
        margin: '0',
        textTransform: 'uppercase',
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
    menuItem: {
      padding: '0px',
      margin: '0px',
    },
    menuVert: {
      margin: '5px 0px 0px 0px',
      padding: '5px',
    },
  }
))

function MemoryCard(props) {

  const { memory, user } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [findUsersOpen, setFindUsersOpen] = useState(false);

  const toggleExpand = (event) => {
    Boolean(anchorEl)
      ?
      closeExpand(event)
      :
      openExpand(event);
  }

  const openExpand = (event) => {
    setAnchorEl(
      event.currentTarget
    );
  };

  const closeExpand = () => {
    setAnchorEl(
      null
    );
  };

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
        title={<h3>{memory.headline}</h3>}
        autoCorrect="false"
        disableTypography={true}
        action={(!props.activeTable.trash) &&
          <IconButton className={classes.menuVert} onClick={toggleExpand}>
            <MoreVertIcon />
            <Popover
              open={Boolean(anchorEl)}
              onClose={closeExpand}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem className={classes.menuItem}>
                <IconButton onClick={handleSendTrashClick}>
                  <DeleteIcon />
                </IconButton>
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <IconButton onClick={handleShareClick}>
                  <ShareIcon />
                </IconButton>
              </MenuItem>
            </Popover>
          </IconButton>
        }
      />
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

          {/* <span style={{ marginLeft: 'auto' }}>
            <Chip
              label="#opa"
              variant="default"
              color="secondary"

              onClick={handleTagClick}
              onDelete={handleTagDelete}
            />
            <IconButton >
              <TagIcon />
            </IconButton>
          </span> */}
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
    </Card >
  )
}

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, { openSnackbar })(withRouter(MemoryCard));