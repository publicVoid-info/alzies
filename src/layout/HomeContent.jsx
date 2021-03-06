import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { getFirestore } from '../helpers/firebase'
import settings from '../helpers/settings'

import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import CodeIcon from '@material-ui/icons/Code'
import GetAppIcon from '@material-ui/icons/GetApp'
import AddIcon from '@material-ui/icons/Add'
import Container from '@material-ui/core/Container'

import EmptyState from './EmptyState'
import MemoryList from '../components/memory/MemoryList'
import LaunchScreen from '../layout/LaunchScreen'

const styles = theme => ({
  emptyStateIcon: {
    fontSize: theme.spacing(12)
  },
  installButton: {
    display: 'none',
    marginTop: theme.spacing(1)
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: 0,
    right: theme.spacing(2)
  }
})

let installPromptEvent

const handleInstallApp = () => {
  installPromptEvent.prompt()
  installPromptEvent.userChoice.then(choice => {
    // Clear the saved prompt since it can't be used again
    installPromptEvent = null
    document.querySelector('#install-app').style.display = 'none'
  })
}

window.addEventListener('beforeinstallprompt', event => {
  document.querySelector('#install-app').style.display = 'inline-flex'
  installPromptEvent = event
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault()
})

class HomeContent extends Component {
  constructor(props) {
    super(props)

    this.unsubscribe = null
    this.handleUpdateList = this.handleUpdateList.bind(this)
    this.state = {
      memoryList: []
    }
  }

  sortMemories(memoryList, posicoes) {
    //caso venha vazio, é primeira vez, inicializa
    if (posicoes.memoryId.length === 0) {
      memoryList.forEach((v, i) => posicoes.memoryId.push(v.id))
    }

    const sortedResult = memoryList
      .map(m => {
        const posicaoEncontrada = posicoes.memoryId.findIndex(id => id === m.id)

        return {
          ...m,
          indexSort:
            posicaoEncontrada === -1
              ? posicoes.memoryId.length
              : posicaoEncontrada
        }
      })
      .sort((a, b) => a.indexSort - b.indexSort)

    this.setState({
      memoryList: sortedResult
    })
  }

  getMemories() {
    const userId = this.props.user.uid

    //limpa o listener anterior
    if (this.unsubscribe) {
      this.unsubscribe()
    }

    this.unsubscribe = getFirestore()
      .collection(this.props.activeTable.memories)
      .where('owner', 'array-contains', userId)
      .onSnapshot(qs => {
        const result = []

        qs.forEach(doc => result.push({ id: doc.id, ...doc.data() }))

        getFirestore()
          .collection(this.props.activeTable.memoryPosition)
          .doc(userId)
          .get()
          .then(doc =>
            this.sortMemories(
              result,
              doc.exists ? doc.data() : { memoryId: [] }
            )
          )
          .catch()
      })
  }

  handleUpdateList(memoryList) {
    const userId = this.props.user.uid

    getFirestore()
      .collection(this.props.activeTable.memoryPosition)
      .doc(userId)
      .set({ memoryId: memoryList.map(item => item.id) })
      .then(
        this.setState({
          memoryList: memoryList
        })
      )
      .catch()
  }

  filtroSearch(searchInput) {
    //caso o input seja length 0, significa q acabou de limpar a pesquisa, carrega os caboclos originais
    if (searchInput.length > 0) {
      const filteredList = this.state.memoryList.filter(value => {
        return value.headline.toUpperCase().indexOf(searchInput) > -1
      })

      this.setState({
        memoryList: filteredList
      })
    } else {
      this.getMemories()
    }
  }

  componentDidMount() {
    if (this.props.isSignedIn && this.props.user) {
      this.getMemories()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //caso nao esteja logado, zera o memorylist, para nao aparecer qd troca usuario
    if (!this.props.isSignedIn || !this.props.user) {
      if (this.state.memoryList.length > 0) {
        this.setState({
          memoryList: []
        })

        return
      }
    }

    //caso tenha mudado o active table, recarrega
    if (this.props.activeTable !== prevProps.activeTable) {
      this.getMemories()
    }

    //se o prop de pesquisa for diferente do estado, filtra
    if (prevProps.searchInput !== this.props.searchInput) {
      this.filtroSearch(this.props.searchInput.toUpperCase())

      return
    }

    if (this.props.isSignedIn && this.props.user) {
      if (
        this.props.searchInput.length === 0 &&
        this.state.memoryList.length === 0
      ) {
        this.getMemories()
        return
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  render() {
    // Styling
    const { classes } = this.props

    if (!this.props.isSignedIn) {
      if (this.props.isAuthReady) {
        return <LaunchScreen />
      } else {
        return (
          <EmptyState
            icon={
              <CodeIcon className={classes.emptyStateIcon} color="action" />
            }
            title={settings.title}
            description="Não ofereço clareiras a razão, virem-se"
            button={
              <Button
                id="install-app"
                className={classes.installButton}
                variant="outlined"
                color="primary"
                onClick={handleInstallApp}
              >
                <GetAppIcon className={classes.buttonIcon} />
                Get App
              </Button>
            }
          />
        )
      }
    }

    return (
      this.props.user && (
        <React.Fragment>
          <Container className={classes.container} maxWidth="md">
            <MemoryList
              classes={this.props.classes}
              memoryList={this.state.memoryList}
              onUpdateList={this.handleUpdateList}
            />
          </Container>

          <Link to="/memory/add">
            <Fab className={classes.fab} color="primary" label="Add">
              <AddIcon />
            </Fab>
          </Link>
        </React.Fragment>
      )
    )
  }
}

HomeContent.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const storeState = state
  return storeState
}

export default connect(mapStateToProps, {})(withStyles(styles)(HomeContent))
