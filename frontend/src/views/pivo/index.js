import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Fab,
  Avatar,
  Typography
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import endpoints from '../../endpoints';
import auth from '../auth/auth';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


class PivoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pivo: null,
      isPivoLoaded: false,
      showError: false,
      showSuccess: false
    };
    this.beerReminder = this.beerReminder.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  async beerReminder() {
    var id = auth.getUserInfo().id;
    console.log(id);
    if (id === null) {
      this.setState({
        showError: true
      })
    }
    else {
      var obvestilo = {
        userId: new Array(id),
        inHours: 1
      }
      console.log(obvestilo);
      fetch(endpoints.pivo + "/beerNotification",
        {
          method: 'post',
          body: JSON.stringify(obvestilo),
          headers: {
            'Authorization': auth.getToken(),
            'Content-Type': 'application/json',
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              showSuccess: true
            })
          }
          else {
            this.setState({
              showError: true
            })
          }
        })
        .catch(error => this.setState({
          showError: true
        }))
    }
  }
  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      showError: false,
      showSuccess: false
    })
  };

  async componentDidMount() {
    fetch(endpoints.pivo + "/listBeer",
      {
        method: 'get',
        headers: {
          'Authorization': auth.getToken(),
        }
      })
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
    const style = {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
      backgroundColor: '#3f51b5',
      color: 'white'
    };
    const error = (
      <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="error">
          Prišlo je do napake pri nastavljanju obvestila za pivo.
        </MuiAlert>
      </Snackbar>
    );
    const success = (
      <Snackbar open={this.state.showSuccess} autoHideDuration={3000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="success">
          Obvestilo za pivo je bilo uspešno nastavljeno.
        </MuiAlert>
      </Snackbar>
    );

    var pivo = [];
    if (this.state.isPivoLoaded) {
      pivo = this.state.pivo
    }
    return (
      <Page
        title="Products"
      >
        {error}
        {success}
        <Container maxWidth={false}>
          <Fab variant="extended" style={style} onClick={this.beerReminder}>
            <Avatar
              src={'/static/images/beer.svg'}
              variant="square" />
            <Typography
              color="inherit"
              variant="h6"
            >
              Spomni me na pivo
            </Typography>
          </Fab>
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
