import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const data = [
  {
    id: uuid(),
    name: 'Prižgala se je luč',
    imageUrl: '/static/images/lightbulb.svg',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Izklopili ste sledenje urniku za luč',
    imageUrl: '/static/images/lightbulb.svg',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Predvaja se glasba',
    imageUrl: '/static/images/speaker.svg',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Vaše pivo je nalito',
    imageUrl: '/static/images/beer.svg',
    updatedAt: moment().subtract(5, 'hours')
  }
];

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

const LatestProducts = ({ className, obvestila, ...rest }) => {
  const classes = useStyles();
  const [products] = useState(data);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        subtitle={`${products.length} in total`}
        title="Zadnja obvestila"
      />
      <Divider />
      <List>
        {obvestila.slice(0,5).map((product, i) => (
          <ListItem
            divider={i < products.length - 1}
            key={product.id}
          >
            <ListItemAvatar>
              <img
                alt="Product"
                className={classes.image}
                src={'/static/images/notification.svg'}
              />
            </ListItemAvatar>
            <ListItemText
              primary={product.text}
              secondary={`${moment(product.showDateTime).fromNow()}`}
            />
            <IconButton
              edge="end"
              size="small"
            >
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          component={RouterLink}
          to={'/app/obvestila'}
        >
          Poglej vse
        </Button>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string,
  obvestila: PropTypes.object
};

export default LatestProducts;
