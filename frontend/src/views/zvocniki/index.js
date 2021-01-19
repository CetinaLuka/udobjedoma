import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  Fab,
  Modal,
  TextField,
  Button
} from '@material-ui/core';
import { Formik } from 'formik';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import endpoints from '../../endpoints';
import auth from '../auth/auth';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class ZvocnikiView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pesmi: null,
      isPesmiLoaded: false,
      stanje: false,
      isStanjeLoaded: false,
      modal: false,
      showSuccess: false,
      showError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addSong = this.addSong.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleClose() {
    this.setState({
      modal: false,
      showError: false,
      showSuccess: false
    })
  }
  handleChange() {
    const currentState = this.state.stanje;
    if (currentState) {
      this.ugasni()
    }
    else {
      this.prizgi()
    }
    this.setState({
      stanje: !currentState,
    });
  }
  async ugasni() {
    fetch(endpoints.zvocniki + "/izklop",
      {
        method: 'put',
        headers: { 'Authorization': auth.getToken() }
      })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  async prizgi() {
    fetch(endpoints.zvocniki + "/vklop",
      {
        method: 'put',
        headers: { 'Authorization': auth.getToken() }
      })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
      })
  }
  
  openModal() {
    this.setState({
      modal: true
    })
  }
  async addSong(ime, povezava) {
    var glasba = {
      ime: ime,
      povezava: povezava
    }
    fetch(endpoints.zvocniki + "/dodajGlasbo?ime="+ime+"&povezava="+povezava,
      {
        method: 'post',
        headers: {
          'Authorization': auth.getToken(),
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            showSuccess: true,
            modal: false
          });
          this.componentDidMount();
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
  handleSubmit(event) {
    event.preventDefault();
    var ime = event.target.ime.value;
    var povezava = event.target.povezava.value;
    console.log("Ime: " + ime + " povezava: " + povezava);
    this.addSong(ime, povezava);
  }
  async componentDidMount() {
    fetch(endpoints.zvocniki + "/pridobiVseGlasbe",
      {
        headers: {
          method: 'get',
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
        method: 'get',
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
    const modalStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    var pesmi = [];
    if (this.state.isPesmiLoaded) {
      pesmi = this.state.pesmi.glasbe
    }
    var pesmiView = '';
    var stanje = "Izklopljeni";
    if (this.state.isStanjeLoaded) {
      if (this.state.stanje) {
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
    const error = (
      <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="error">
          Prišlo je do napake pri dodajanju pesmi.
        </MuiAlert>
      </Snackbar>
    );
    const success = (
      <Snackbar open={this.state.showSuccess} autoHideDuration={3000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="success">
          Pesem je bila uspešno dodana.
        </MuiAlert>
      </Snackbar>
    );
    return (
      <Page
        title="Zvocniki"
      >
        <Container maxWidth={false}>
          {error}
          {success}
          <Fab variant="extended" style={style} onClick={this.openModal}>
            <PlaylistAddIcon />
            <Typography
              color="inherit"
              variant="h6"
            >
              Dodaj pesem
            </Typography>
          </Fab>
          <Modal
            open={this.state.modal}
            onClose={this.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={modalStyle}
          >
            <Card
              style={{ marginTop: "25px", width: '400px' }}
            >
              <CardContent>
                <Typography
                  align="center"
                  color="textPrimary"
                  gutterBottom
                  variant="h4"
                >
                  Dodaj pesem
              </Typography>
                <Formik
                  initialValues={{
                    ime: '',
                    povezava: ''
                  }}
                >
                  {({
                    handleBlur,
                    handleChange,
                    values
                  }) => (
                    <form onSubmit={this.handleSubmit}>
                      <TextField
                        label="Ime pesmi"
                        margin="normal"
                        name="ime"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="input"
                        value={values.ime}
                        variant="outlined"
                      />
                      <br />
                      <TextField
                        label="Povezava do pesmi"
                        margin="normal"
                        name="povezava"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="input"
                        value={values.povezava}
                        variant="outlined"
                      />
                      <div>
                        <Button
                          color="primary"
                          size="large"
                          type="submit"
                          fullWidth
                          variant="contained"
                        >
                          Dodaj
                      </Button>
                      </div>

                    </form>
                  )}
                </Formik>
              </CardContent>
            </Card>

          </Modal>
          <Card
            style={{ marginTop: "25px" }}
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
