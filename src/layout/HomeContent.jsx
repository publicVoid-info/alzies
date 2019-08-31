import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { getFirestore } from '../helpers/firebase';

import Fab from '@material-ui/core/Fab';
import CodeIcon from '@material-ui/icons/Code';
import HomeIcon from '@material-ui/icons/Home';
import GitHubCircleIcon from 'mdi-material-ui/GithubCircle';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';

import EmptyState from './EmptyState';
import MemoryList from '../components/memory/MemoryList';
import Drawer from '../layout/Drawer';

const styles = (theme) => ({
  emptyStateIcon: {
    fontSize: theme.spacing(12)
  },
  button: {
    marginTop: theme.spacing(1)
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: 0,
    right: theme.spacing(2),
  },
  container: {
    // display: 'flex',
    // flexDirection: 'row-reverse',
  },
});

class HomeContent extends Component {
  constructor(props) {
    super(props);

    this.unsubscribe = null;
    this.handleUpdateList = this.handleUpdateList.bind(this);
    this.state = {
      memoryList: []
    }
  }

  sortMemories(memoryList, posicoes) {

    //caso venha vazio, é primeira vez, inicializa
    if (posicoes.memoryId.length === 0) {
      memoryList.forEach((v, i) => posicoes.memoryId.push(v.id))
    }

    const sortedResult = memoryList.map((m) => {

      const posicaoEncontrada = posicoes.memoryId.findIndex((id) => id === m.id);

      return {
        ...m,
        indexSort:
          (posicaoEncontrada === -1)
            ? posicoes.memoryId.length
            : posicaoEncontrada
      }

    }).sort((a, b) => a.indexSort - b.indexSort);

    this.setState({
      memoryList: sortedResult
    });
  }

  getMemories() {

    const userId = this.props.user.uid;

    //limpa o listener anterior
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.unsubscribe =
      getFirestore().collection('memories')
        .where('owner', 'array-contains', userId)
        .onSnapshot((qs) => {

          const result = [];

          qs.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));

          getFirestore().collection('memoryPosition')
            .doc(userId)
            .get()
            .then((doc) =>
              this.sortMemories(
                result,
                (doc.exists)
                  ?
                  doc.data()
                  :
                  { memoryId: [] }
              )
            )
            .catch();
        });
  }

  handleUpdateList(memoryList) {

    const userId = this.props.user.uid;

    getFirestore().collection('memoryPosition')
      .doc(userId)
      .set({ memoryId: memoryList.map(item => item.id) })
      .then(
        this.setState({
          memoryList: memoryList
        })
      )
      .catch();
  }

  componentDidMount() {

    if (this.props.isSignedIn && this.props.user) {
      this.getMemories();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const searchInput = this.props.searchInput.toUpperCase();

    if (prevProps.searchInput !== this.props.searchInput) {

      if (searchInput.length > -1) {
        const filteredList =
          this.state.memoryList.filter((value) => {
            return value.headline.toUpperCase().indexOf(searchInput) > -1;
          });

        this.setState({
          memoryList: filteredList
        });
      }
    } else {
      if (this.props.isSignedIn && this.props.user) {
        if (searchInput.length === 0 && this.state.memoryList.length === 0) {
          this.getMemories();
        }
      } else {
        if (this.state.memoryList.length > 0) {
          this.setState({
            memoryList: []
          });
        }
      }
    }
  }

  componentWillUnmount() {

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {

    // Styling
    const { classes } = this.props;

    // Properties
    const { isSignedIn, title, user } = this.props;

    if (!isSignedIn) {
      return (
        <EmptyState
          icon={<CodeIcon className={classes.emptyStateIcon} color="action" />}
          title={title}
          description="Não ofereço clareiras a razão, virem-se"
          button={
            <Fab
              className={classes.button}
              color="secondary"
              href="https://github.com/DonOctavioDelFlores/alzies"
              rel="noopener noreferrer"
              target="_blank" variant="extended">
              <GitHubCircleIcon className={classes.buttonIcon} />
              github
          </Fab>
          }
        />
      )
    }

    return (user)
      ?
      <React.Fragment>

        <Drawer
          open={this.props.drawerOpen}
          elevation="16"
          onToggleDrawer={this.props.onToggleDrawer}
        />
        <Container className={classes.container} maxWidth="md">
          <MemoryList
            classes={this.props.classes}
            memoryList={this.state.memoryList}
            onUpdateList={this.handleUpdateList} />
        </Container>

        <Link to="/memory/add">
          <Fab className={classes.fab} color="primary" label="Add">
            <AddIcon />
          </Fab>
        </Link>
      </React.Fragment>
      :
      (
        < EmptyState
          icon={< HomeIcon className={classes.emptyStateIcon} color="action" />}
          title="Home"
          description=""
        />
      );
  }
}

HomeContent.propTypes = {
  classes: PropTypes.object.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
};

export default withStyles(styles)(HomeContent);