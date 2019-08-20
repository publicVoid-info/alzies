import React from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import Home from './components/Home'
import Welcome from './components/Welcome'
import MemoryEditor from './components/memory/MemoryEditor'
import NoMatch from './components/NoMatch'

export default () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Welcome} />
            <Route exact path='/home' component={Home} />
            <Route exact path='/memory/:id' component={MemoryEditor} />
            <Route component={NoMatch} />
        </Switch>
    </BrowserRouter >
)