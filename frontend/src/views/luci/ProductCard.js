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
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';

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
    this.setState({
      checked: !currentState,
    });
  }
  handleUrnikChange(){
    const currentState = this.state.urnikChecked;
    this.setState({
      urnikChecked: !currentState,
    });
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
