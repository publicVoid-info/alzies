import React from 'react'
import { Link } from 'react-router-dom'

import MemoryList from './memory/MemoryList'
import Header from './Header'
import Fab from './buttons/FloatingActionButton'

export default function Home(props) {

  return (
    <React.Fragment>
      <nav >
        <Header />
      </nav>
      <main>        
        <MemoryList />
        <Link to="/memory/add">
          <Fab />
        </Link>
      </main>
    </React.Fragment>
  );
}



