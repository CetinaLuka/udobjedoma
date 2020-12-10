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
import endpoints from '../../endpoints';


class PivoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pivo: null,
      isPivoLoaded: false
    };
  }

  async componentDidMount() {
    fetch(endpoints.pivo + "/listBeer")
      .then(res => res.json())
      .then((result) => {
        var pivo = result
        console.log(pivo);
        this.setState({
          pivo: pivo,
          isPivoLoaded: true
        });
      })
  }


  render() {

    var pivo = [];
    if(this.state.isPivoLoaded){
      pivo = this.state.pivo
    }
    return (
      <Page
        title="Products"
      >
        <Container maxWidth={false}>
          <Box mt={3}>
            <Grid
              container
              spacing={3}
            >
              {pivo.map((product) => (
                <Grid
                  item
                  key={product.id}
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <ProductCard
                    product={product}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Page>
    );
  }
}

export default PivoView;
