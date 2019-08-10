import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SaveIcon from '@material-ui/icons/Save'

const useStyles = makeStyles(() => (
  {
    card: {
      margin: '10px',
      width: '440px',
      float: 'left'
    },
    saveButton: {
      marginLeft: 'auto'
    }
  }
))


export default function MemoryCard({ memory, onClickSave }) {

  const classes = useStyles()

  return (


    <Card className={classes.card} elevation={4} >
      <CardHeader title={memory.headline} autoCorrect="false" />
      <CardContent autoCorrect="false" >
        <Typography variant="body2" color="textSecondary" component="p">
          {memory.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton className={classes.saveButton} onClick={() => onClickSave(memory)}>
          <SaveIcon />
        </IconButton>
      </CardActions>
    </Card >
  )
}