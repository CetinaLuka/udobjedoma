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
  Switch,
  IconButton
} from '@material-ui/core';
import endpoints from '../../endpoints';
import auth from '../auth/auth';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.product.prizgana,
      urnikChecked: this.props.product.slediUrniku,
      showSuccess: false,
      showError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUrnikChange = this.handleUrnikChange.bind(this);
    this.delete = this.delete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    this.setState({
      showError: false,
      showSuccess: false
    })
  }
  handleChange() {
    const currentState = this.state.checked;
    if (currentState) {
      this.ugasni()
    }
    else {
      this.prizgi()
    }
    this.setState({
      checked: !currentState,
    });
  }
  handleUrnikChange() {
    const currentState = this.state.urnikChecked;
    if (currentState) {
      this.nesledi()
    }
    else {
      this.sledi()
    }
    this.setState({
      urnikChecked: !currentState,
    });
  }
  async delete() {
    if(this.props.product.lucId === undefined || this.props.lucId === undefined){
      console.log("id undefined");
      return;
    }
    fetch(endpoints.luci + "/luci/delete/" + this.props.sobaId + "/" + this.props.product.lucId,
      {
        method: 'delete',
        headers: {
          'Authorization': auth.getToken(),
        }
      })
      .then(res => {
          this.setState({
            showSuccess: true
          });
          this.props.updater();
      })
      .catch(error => this.setState({
        showError: true
      }))
  }
  async ugasni() {
    fetch(endpoints.luci + "/luci/ugasni/" + this.props.sobaId + "/" + this.props.product.lucId + "?id=" + auth.getUserInfo().id,
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
  async prizgi() {
    fetch(endpoints.luci + "/luci/prizgi/" + this.props.sobaId + "/" + this.props.product.lucId + "?id=" + auth.getUserInfo().id,
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
  async sledi() {
    fetch(endpoints.luci + "/luci/slediurniku/" + this.props.sobaId + "/" + this.props.product.lucId + "?id=" + auth.getUserInfo().id,
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
  async nesledi() {
    fetch(endpoints.luci + "/luci/neslediurniku/" + this.props.sobaId + "/" + this.props.product.lucId + "?id=" + auth.getUserInfo().id,
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

    const error = (
      <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="error">
          Prišlo je do napake pri brisanju luči.
        </MuiAlert>
      </Snackbar>
    );
    const success = (
      <Snackbar open={this.state.showSuccess} autoHideDuration={3000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="success">
          Luč je bila uspešno izbrisana.
        </MuiAlert>
      </Snackbar>
    );
    return (
      <Card
      >
        {error}
        {success}
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
            <p>lokacija: {this.props.soba}</p>
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
                <IconButton aria-label="delete" onClick={this.delete}>
                  <DeleteIcon />
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  };
}
export default ProductCard;
