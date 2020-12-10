import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';


const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    height: 56,
    width: 56
  }
}));

const TotalProfit = ({ className, steviloHladnihPiv, ...rest }) => {
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
              ŠTEVILO POPOLNO OHLAJENIH PIV
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {steviloHladnihPiv}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}
              src={'/static/images/beer.svg'}
              variant="square">
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string,
  steviloHladnihPiv: PropTypes.number
};

export default TotalProfit;
