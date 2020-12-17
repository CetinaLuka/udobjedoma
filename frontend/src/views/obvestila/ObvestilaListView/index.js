import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import endpoints from '../../../endpoints';
import auth from '../../auth/auth';

class ObvestilaListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isObvestilaLoaded: false,
      obvestila: []
    };
  }
  async componentDidMount() {
    fetch(endpoints.obvestila+"/listNotifications/"+auth.getUserInfo().id,
    {
      headers: {
        'Authorization': auth.getToken(),
      }
    })
    .then(res => res.json())
    .then((result) => {
      var obvestila = result
      console.log(obvestila);
      this.setState({
        isObvestilaLoaded: true,
        obvestila: obvestila
      });
    })
  }
  render() {
    var results = '';
    if(this.state.isObvestilaLoaded){
      results = (
        <Results customers={this.state.obvestila} />
      );
    }
    return (
      <Page
      style={{paddingTop: "25px"}}
        >
        <Container maxWidth={false}>
          <Box mt={3}>
            {results}
          </Box>
        </Container>
      </Page >
    );
  }
}
const useStyles = makeStyles((theme) => ({
  root: {

  }
}));

export default ObvestilaListView;
