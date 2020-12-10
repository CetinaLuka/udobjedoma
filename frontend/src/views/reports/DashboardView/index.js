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
      isObvestilaLoaded: false,
      trenutnoPredvajanaGlasba: null,
      isGlasbaLoaded: false,
      stanjeZvocnika: false,
      pivo: null,
      isPivoLoaded: false
    };
  }
  async componentDidMount() {
    fetch(endpoints.luci+"/luci")
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
      var obvestila = result.reverse();
      this.setState({
        isObvestilaLoaded: true,
        obvestila: obvestila
      });
    })
    fetch(endpoints.zvocniki+"/pridobiTrenutnoPredvajanoGlasbo")
    .then(res => res.json())
    .then((result) => {
      var glasba = result
      this.setState({
        isGlasbaLoaded: true,
        trenutnoPredvajanaGlasba: glasba.predvajano
      });
    })
    fetch(endpoints.zvocniki+"/preveriStanje")
    .then(res => res.json())
    .then((result) => {
      var glasba = result
      console.log(glasba);
      this.setState({
        stanjeZvocnika: glasba.stanje
      });
    })
    fetch(endpoints.pivo+"/listBeer")
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
    var trenutnaGlasba = {
      Ime: "nobena skladba se ne predvaja",
      Povezava: " ",
      ID: " "
    };
    if(this.state.isGlasbaLoaded){
      if(this.state.trenutnoPredvajanaGlasba != "-1"){
        trenutnaGlasba = this.state.trenutnoPredvajanaGlasba;
      }
      console.log(trenutnaGlasba);
    }
    var obvestila = [];
    if(this.state.isObvestilaLoaded){
      obvestila = this.state.obvestila.reverse();
    }
    var steviloPiv = 0;
    var steviloHladnihPiv = 0;
    if(this.state.isPivoLoaded){
      this.state.pivo.forEach((vrsta) => {
        vrsta.beerList.forEach((pivo) => {
          steviloPiv++;
          if(pivo.temperature >= 4 && pivo.temperature <= 8){
            steviloHladnihPiv++;
          }
        })
      })
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
              <TotalCustomers glasba={trenutnaGlasba} stanje={this.state.stanjeZvocnika}/>
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TasksProgress steviloPiv={steviloPiv} />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalProfit steviloHladnihPiv={steviloHladnihPiv}/>
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
              <LatestProducts obvestila={obvestila}/>
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}


export default Dashboard;
