import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Card, CardContent, Typography, Switch, FormControlLabel } from '@material-ui/core';
import { getFirebase } from '../helpers/firebase';

const styles = theme => ({
    card: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2
    },
    noteTextPos: {
        marginTop: theme.spacing.unit * 2
    }
});

class Notifications extends Component {
    constructor(props) {
        super(props);
    }

    renderSubscriptionOptions(classes) {
        if (!('serviceWorker' in navigator) && !('PushManager' in window)) {
            return (
                <Typography className={classes.noteTextPos}>
                    Notification feature is supported only in:<br />
                    Chrome Desktop and Mobile (version 50+)<br />
                    Firefox Desktop and Mobile (version 44+)<br />
                    Opera on Mobile (version 37+)
                </Typography>
            );
        } else {
            return (
                <Fragment>
                    <FormControlLabel
                        control={<Switch />}
                        label="Enable/Disable GNIB(IRP) Appointment Notifications"
                        onChange={this.gnibApptSubscriptionToggle}
                        checked={this.state.gnibApptSubscriptionToggleSwitch}
                    />
                </Fragment>
            );
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Card className={classes.card}>
                    <CardContent>
                        {this.renderSubscriptionOptions(classes)}
                    </CardContent>
                </Card>
            </Fragment>
        );
    }
}

Notifications.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Notifications);