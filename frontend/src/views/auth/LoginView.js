import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import auth from './auth';
import endpoints from '../../endpoints';

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      showError: false,
      showSuccess: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    var ime = event.target.email.value;
    var geslo = event.target.password.value;
    this.login(ime, geslo);
  }
  async login(ime, geslo) {
    var token = '';
    fetch(endpoints.uporabniki + "/prijava?upoIme=" + ime + "&geslo=" + geslo, { method: 'post' })
      .then(res => {
        token = res.headers.get('Authorization');
        return res.json();
      })
      .then(response => {
        console.log(response);
        console.log(token);
        if (response.id !== "null") {
          auth.setToken(token, true);
          auth.setUserInfo(response, true);
          this.setState({
            redirect: true,
            showSuccess: true
          });
          this.props.navigate("/app/dashboard");
        }
        else {
          this.setState({
            showError: true
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          showError: true
        });
      })

  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      showError: false
    })
  };


  render() {
    const error = (
      <Snackbar open={this.state.showError} autoHideDuration={6000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="error">
          Prijava ni veljavna
        </MuiAlert>
      </Snackbar>
    );
    const success = (
      <Snackbar open={this.state.showSuccess} autoHideDuration={6000} onClose={this.handleClose}>
        <MuiAlert onClose={this.handleClose} severity="success">
          <RouterLink to="/app/dashboard" >Prijava je uspešna. Odpri dashboard</RouterLink>
        </MuiAlert>
      </Snackbar>
    );
    return (
      <Page
        title="Prijava"
      >
        {error}
        {success}
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <Container maxWidth="sm">
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().max(255).required('Uporabniško ime je zahtevano'),
                password: Yup.string().max(255).required('Geslo je zahtevano')
              })}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
              }) => (
                <form onSubmit={this.handleSubmit}>
                  <Box mb={3}>
                    <Typography
                      color="textPrimary"
                      variant="h2"
                    >
                      Prijava
                      </Typography>
                  </Box>
                  <Box
                    mt={3}
                    mb={1}
                  >
                  </Box>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Uporabniško ime"
                    margin="normal"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="input"
                    value={values.email}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Geslo"
                    margin="normal"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                  <Box my={2}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Prijava
                      </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Container>
        </Box>
      </Page>
    );
  }
}

export default LoginView;
