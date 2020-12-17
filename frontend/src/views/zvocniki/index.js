import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import endpoints from '../../endpoints';
import auth from '../auth/auth';

class ZvocnikiView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pesmi: null,
      isPesmiLoaded: false,
      stanje: false,
      isStanjeLoaded: false
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(){
    const currentState = this.state.stanje;
    if(currentState){
      this.ugasni()
    }
    else{
      this.prizgi()
    }
    this.setState({
      stanje: !currentState,
    });
  }
  async ugasni(){
    fetch(endpoints.zvocniki+"/izklop", 
    {
      method: 'put',
      headers: {'Authorization': auth.getToken()}
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  async prizgi(){
    fetch(endpoints.zvocniki+"/vklop", 
    {
      method: 'put',
      headers: {'Authorization': auth.getToken()}
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }

  async componentDidMount() {
    fetch(endpoints.zvocniki + "/pridobiVseGlasbe", 
    {
      headers: {
        'Authorization': auth.getToken(),
      }
    })
      .then(res => res.json())
      .then((result) => {
        var pesmi = result
        console.log(pesmi);
        this.setState({
          pesmi: pesmi,
          isPesmiLoaded: true
        });
      })
      fetch(endpoints.zvocniki + "/preveriStanje", 
      {
        headers: {
          'Authorization': auth.getToken(),
        }
      })
      .then(res => res.json())
      .then((result) => {
        var glasba = result
        console.log(glasba);
        this.setState({
          stanje: glasba.stanje,
          isStanjeLoaded: true
        });
      })
  }


  render() {
    var pesmi = [];
    if (this.state.isPesmiLoaded) {
      pesmi = this.state.pesmi.glasbe
    }
    var pesmiView = '';
    var stanje = "Izklopljeni";
    if(this.state.isStanjeLoaded){
      if(this.state.stanje){
        stanje = "Vlopljeni";
        pesmiView = (
          <Grid
              container
              spacing={3}
            >
              {pesmi.map((product) => (
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
        );
      }
    }
    return (
      <Page
        title="Zvocniki"
      >
        <Container maxWidth={false}>
          <Card
            style={{marginTop: "25px"}}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="center"
                mb={3}
              >
                
              </Box>
              <Typography
                align="center"
                color="textPrimary"
                gutterBottom
                variant="h4"
              >
                ZVOČNIKI
              </Typography>
              <Typography
                align="center"
                color="textPrimary"
                variant="body1"
              >
                {stanje}
              </Typography>
              <Switch checked={this.state.stanje} onChange={this.handleChange} name="vklopljeno" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                vklop/izklop
              </Typography>
            </CardContent>
            <Box flexGrow={1} />
          </Card>
          <Box mt={3}>
            {pesmiView}
          </Box>
        </Container>
      </Page>
    );
  }
}

export default ZvocnikiView;
