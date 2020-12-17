import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import endpoints from '../../endpoints';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { IconButton } from '@material-ui/core';
import auth from '../auth/auth';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.playSong = this.playSong.bind(this);
  }
  async playSong(){
    fetch(endpoints.zvocniki + "/predvajajDrugoGlasbo?id="+this.props.product.ID, 
    {
      method: 'post',
      headers: {
        'Authorization': auth.getToken(),
      }
    })
      .then(res => res.json())
      .then((result) => {
        var pesmi = result
        console.log(pesmi);
      })
  }

  render() {
    return (
      <Card
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            mb={3}
          >
            <MusicNoteIcon></MusicNoteIcon>
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {this.props.product.Ime}
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="body1"
          >
            {this.props.product.Povezava}
          </Typography>
        </CardContent>
        <Box flexGrow={1} />
        <Divider />
        <Box p={2}>
          <Grid
            container
            justify="space-between"
            spacing={2}
          >
            <Grid
              item
              alignItems="center"
            >
              <IconButton aria-label="play" onClick={this.playSong}>
                <PlayCircleFilledIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  }

}

export default ProductCard;
