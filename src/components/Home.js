import React from 'react'
import MemoryList from './memory/MemoryList'
import Header from './Header'

class Home extends React.Component {

  render() {

    return (
      <nav >
        <Header />
        <main>
          <MemoryList />
        </main>
      </nav>
    );
  }
}

export default Home;
