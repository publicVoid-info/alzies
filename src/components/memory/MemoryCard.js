import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'

const useStyles = makeStyles(theme => ({
  card: {
    margin: '10px',
    maxWidth: '440px',
    float: 'left'
  },
  expand: {
    marginLeft: 'auto'
  }
}))

export default function MemoryCard({ memory }) {

  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={4}>
      <CardHeader
        title={memory.headline}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {memory.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="edit" className={classes.expand} >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
