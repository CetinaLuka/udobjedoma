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
  makeStyles,
  Button
} from '@material-ui/core';
import endpoints from '../../endpoints';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pivo: null,
      isPivoLoaded: false
    };
    this.nalijPivo = this.nalijPivo.bind(this);
  }

  nalijPivo() {
    var amount = { amount: 1 }
    fetch(endpoints.pivo + "/pourBeer/" + this.props.product._id,
      {
        method: "put",
        body: JSON.stringify(amount),
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(res => res.json())
      .then((result) => {
        var pivo = result
        console.log(pivo);
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
            <Avatar
              alt="Product"
              src={'/static/images/beer.svg'}
              variant="square"
            />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {this.props.product.name}
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="body1"
          >
            {this.props.product.brewery}
          </Typography>
          <br/>
          <Box
            display="flex"
            justifyContent="center"
            mb={3}
          >
            <Button style={{ color: "white", backgroundColor: "rgb(63, 81, 181)", align: "middle" }} onClick={this.nalijPivo}>Nalij pivo</Button>
          </Box>

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
            >
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                Na zalogi: {this.props.product.beerList.length}
              </Typography>
            </Grid>
            <Grid
              item
            >
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                {this.props.product.alcoholPercentage}
                % alkohola
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  }
}

export default ProductCard;
