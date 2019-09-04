import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { getFirestore } from '../helpers/firebase';
import { toggleDrawer } from '../store/actions';
import settings from '../helpers/settings';

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

  handleToggleDrawer = () => {
    this.props.toggleDrawer(!this.props.drawer.open);
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

  filtroSearch(searchInput) {

    //caso o input seja length 0, significa q acabou de limpar a pesquisa, carrega os caboclos originais
    if (searchInput.length > 0) {
      const filteredList =
        this.state.memoryList.filter((value) => {
          return value.headline.toUpperCase().indexOf(searchInput) > -1;
        });

      this.setState({
        memoryList: filteredList
      });
    } else {
      this.getMemories();
    }
  }

  componentDidMount() {

    if (this.props.isSignedIn && this.props.user) {
      this.getMemories();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    //caso nao esteja logado, zera o memorylist, para nao aparecer qd troca usuario
    if (!this.props.isSignedIn || !this.props.user) {
      if (this.state.memoryList.length > 0) {
        this.setState({
          memoryList: []
        });

        return;
      }
    }

    //se o prop de pesquisa for diferente do estado, filtra
    if (prevProps.searchInput !== this.props.searchInput) {

      this.filtroSearch(this.props.searchInput.toUpperCase());

      return;
    }

    if (this.props.isSignedIn && this.props.user) {
      if (this.props.searchInput.length === 0 && this.state.memoryList.length === 0) {
        this.getMemories();
        return;
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

    if (!this.props.isSignedIn) {
      return (
        <EmptyState
          icon={<CodeIcon className={classes.emptyStateIcon} color="action" />}
          title={settings.title}
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

    return (this.props.user)
      ?
      <React.Fragment>
        <Drawer
          open={this.props.drawer.open}
          elevation="16"
          onToggleDrawer={this.handleToggleDrawer}
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
};

const mapStateToProps = (state) => {
  const storeState = state;
  return storeState;
}

export default connect(mapStateToProps, { toggleDrawer })(withStyles(styles)(HomeContent));