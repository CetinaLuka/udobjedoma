import React from 'react';
import clsx from 'clsx';
import PropTypes, { bool } from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    height: 56,
    width: 56
  },
  differenceIcon: {
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const TotalCustomers = ({ className, glasba, stanje, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              ZVOČNIKI
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {glasba.ime}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              {glasba.povezava}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}
              src={'/static/images/speaker.svg'}
              variant="square">
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {stanje ? <PlayCircleFilledIcon className={classes.differenceIcon} /> : <PauseCircleFilledIcon className={classes.differenceIcon} />}
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {stanje ? <span>Glasba se predvaja</span> : <span>Glasba se ne predvaja</span>}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalCustomers.propTypes = {
  className: PropTypes.string,
  glasba: PropTypes.object,
  stanje: PropTypes.bool
};

export default TotalCustomers;
