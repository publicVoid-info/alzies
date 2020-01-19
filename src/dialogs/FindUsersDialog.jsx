import React from 'react'
import { connect } from 'react-redux'
import { getFirestore } from '../helpers/firebase'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Divider from '@material-ui/core/Divider'

class FindUsersDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userList: []
    }
  }

  getUsers = () => {
    const currentUser = this.props.user

    getFirestore()
      .collection('users')
      .get()
      .then(qs => {
        const result = []
        qs.forEach(doc => {
          if (currentUser.uid !== doc.id) {
            result.push({ id: doc.id, ...doc.data() })
          }
        })

        this.setState({
          userList: result
        })
      })
      .catch()
  }

  handleClose = event => {
    this.props.onClose()
  }

  handleKeyPress = event => {
    const key = event.key

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return
    }

    if (key === 'Enter') {
      this.handleClose()
    }
  }

  handleSelect = user => {
    this.props.onSelectUser(user)
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        onKeyPress={this.handleKeyPress}
      >
        <DialogTitle>Share Card</DialogTitle>
        <Divider variant="fullWidth" />
        <DialogContent>
          <MenuList>
            {this.state.userList.map((value, index) => {
              return (
                <MenuItem
                  key={value.uid}
                  onClick={() => this.handleSelect(value)}
                >
                  {value.displayName}
                </MenuItem>
              )
            })}
          </MenuList>
        </DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  const storeState = state
  return storeState
}

export default connect(mapStateToProps, {})(FindUsersDialog)
