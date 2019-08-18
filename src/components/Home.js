import React from 'react'
import { Link } from 'react-router-dom'

import MemoryList from './memory/MemoryList'
import Header from './Header'
import Fab from './buttons/FloatingActionButton'
import AddIcon from '@material-ui/icons/Add'
import Container from '@material-ui/core/Container'

export default function Home(props) {

  return (
    <React.Fragment>
      <nav >
        <Header history={props.history} />
      </nav>
      <main>
        <Container maxWidth="xl">
          <MemoryList />
          <Link to="/memory/add">
            <Fab color="secondary" label="Add">
              <AddIcon />
            </Fab>
          </Link>
        </Container>
      </main>
    </React.Fragment>
  );
}



