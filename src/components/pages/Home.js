import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import SignInManager from '../../helpers/signInManager'

import MemoryList from '../memory/MemoryList'
import Button from '@material-ui/core/Button'
import Fab from '../buttons/FloatingActionButton'
import AddIcon from '@material-ui/icons/Add'
import Container from '@material-ui/core/Container'
import AuthContext from '../../context/authContext'

const useStyles = makeStyles(theme => ({
  signinButton: {
    marginTop: '33vh',
    margin: 'auto',
    width: '36vw',
    height: '8vh',
    fontSize: '1.2em',
  },
  container: {
    textAlign: 'center',
  },
}))

export default function Home(props) {

  const classes = useStyles()
  const currentUser = useContext(AuthContext)

  const verificaSignIn = () => {

    if (!currentUser) {

      const signInState = new SignInManager()

      if (signInState.getSignInState().request) {
        return <React.Fragment />
      } else {
        return (
          <Button
            className={classes.signinButton}
            variant="contained"
            color="secondary"
            size="large"
            onClick={props.handleSignIn}>
            Sign In
          </Button>
        )
      }
    } else {
      return (
        <React.Fragment>
          <MemoryList history={props.history} />
          <Link to="/memory/add">
            <Fab color="secondary" label="Add">
              <AddIcon />
            </Fab>
          </Link>
        </React.Fragment>
      )
    }
  }

  return (

    <Container className={classes.container} maxWidth="md">
      {verificaSignIn()}
    </Container>

  )
}