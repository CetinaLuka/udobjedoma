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
  FormGroup,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import endpoints from '../../endpoints';
import auth from '../auth/auth';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.product.prizgana,
      urnikChecked: this.props.product.slediUrniku
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleUrnikChange=this.handleUrnikChange.bind(this);
  }
  handleChange(){
    const currentState = this.state.checked;
    if(currentState){
      this.ugasni()
    }
    else{
      this.prizgi()
    }
    this.setState({
      checked: !currentState,
    });
  }
  handleUrnikChange(){
    const currentState = this.state.urnikChecked;
    if(currentState){
      this.nesledi()
    }
    else{
      this.sledi()
    }
    this.setState({
      urnikChecked: !currentState,
    });
  }
  async ugasni(){
    fetch(endpoints.luci+"/luci/ugasni/"+this.props.sobaId+"/"+this.props.product.lucId+"?id="+auth.getUserInfo().id,
    {
      headers: {
        'Authorization': auth.getToken(),
      }
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  async prizgi(){
    fetch(endpoints.luci+"/luci/prizgi/"+this.props.sobaId+"/"+this.props.product.lucId+"?id="+auth.getUserInfo().id,
    {
      headers: {
        'Authorization': auth.getToken(),
      }
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  async sledi(){
    fetch(endpoints.luci+"/luci/slediurniku/"+this.props.sobaId+"/"+this.props.product.lucId+"?id="+auth.getUserInfo().id,
    {
      headers: {
        'Authorization': auth.getToken(),
      }
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  async nesledi(){
    fetch(endpoints.luci+"/luci/neslediurniku/"+this.props.sobaId+"/"+this.props.product.lucId+"?id="+auth.getUserInfo().id,
    {
      headers: {
        'Authorization': auth.getToken(),
      }
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
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
              src={'/static/images/lightbulb.svg'}
              variant="square"
            />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {this.props.product.luc}
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="body1"
          >
            <p>svetlost: {this.props.product.svetlost} %</p>
            <p>barva: {this.props.product.barva}</p>
            <p>prizge se ob: {this.props.product.prizgiOb}</p>
            <p>ugasne se ob: {this.props.product.ugasniOb}</p>
            <p>sledi urniku: <Switch checked={this.state.urnikChecked} onChange={this.handleUrnikChange} name="sledi urniku?" /></p>
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
            >
              <Switch checked={this.state.checked} onChange={this.handleChange} name="vklopljeno" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                vklop/izklop
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
                {this.props.soba}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  };
}
export default ProductCard;
