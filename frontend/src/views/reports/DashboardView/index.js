import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import endpoints from './../../../endpoints';
class Dashboard extends React.Component {Page
  constructor(props) {
    super(props);
    this.state = {
      luci: [],
      isLuciLoaded: false,
      obvestila: [],
      isObvestilaLoaded: false
    };
  }
  async componentDidMount() {
    fetch("http://localhost:3000/luci")
      .then(res => res.json())
      .then((result) => {
        var luci = result
        console.log(luci);
        this.setState({
          isLuciLoaded: true,
          luci: luci
        });
      })
    fetch(endpoints.obvestila+"/listNotifications")
    .then(res => res.json())
    .then((result) => {
      var obvestila = result
      console.log(luci);
      this.setState({
        isObvestilaLoaded: true,
        obvestila: obvestila
      });
    })
  }


  render() {
    var steviloPrizganihLuci = 0;
    var sobe = [];
    var luci = [];
    var luciSobe = [];
    if(this.state.isLuciLoaded){
      luci = this.state.luci;
      this.state.luci.forEach(soba => {
        sobe.push(soba.soba);
        var steviloLuciSoba = 0;
        soba.luci.forEach(luc => {
          if(luc.prizgana){
            steviloLuciSoba++;
            steviloPrizganihLuci++;
          }
        })
        luciSobe.push(steviloLuciSoba);
      });
    }
    
    return (
      <Page
        title="Dashboard"
        style={{paddingTop: "25px"}}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget steviloLuci={steviloPrizganihLuci}/>
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalCustomers />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TasksProgress />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalProfit />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <TrafficByDevice sobe={sobe} luci={luci} luciSobe={luciSobe}/>
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <LatestProducts />
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}


export default Dashboard;
