import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import data from './data';
import { ViewArray } from '@material-ui/icons';


class LuciView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      luci: [],
      isLoaded: false,
      test: ["ena", "dva", "tri"]
    };
  }
  async componentDidMount() {
    fetch("http://localhost:3000/luci")
      .then(res => res.json())
      .then((result) => {
        var luci = result
        console.log(luci);
        this.setState({
          isLoaded: true,
          luci: luci
        });
      })
  }

  render() {
    var luciSeznam = '';
    if (this.state.isLoaded == true) {
      console.log(this.state.luci);
      var luciSeznam = this.state.luci.map(
        (soba) => (
          soba.luci.map((luc) => (
            <Grid
              item
              key={luc.lucId}
              lg={4}
              md={6}
              xs={12}
            >
              <ProductCard
                product={luc}
                soba={soba.soba}
              />
            </Grid>
          ))
        )
      );
    }
    const test = (
      this.state.test.map((item) => (
        <p>{item}</p>
      )
      ));


    return (
      <Page
        title="Luci"
      >
        <Container maxWidth={false}>
          <Box mt={3}>
            <Grid
              container
              spacing={3}
            >
              {luciSeznam}
            </Grid >
          </Box >
        </Container>
      </Page>
    );
  };
}

export default LuciView;