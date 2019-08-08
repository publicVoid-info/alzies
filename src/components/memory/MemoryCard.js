import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  card: {
    margin: '10px',
    maxWidth: '400px',
    float: 'left'
  },
  expand: {
    marginLeft: 'auto'
  }
}))

export default function MemoryCard() {

  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={4}>
      <CardHeader
        title="Anotações"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="edit" className={clsx(classes.expand)} >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
