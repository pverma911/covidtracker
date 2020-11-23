
import React, {useEffect, useState} from 'react';
import './App.css';
import coroImg from './images/image.png'


// External imports
import CountUp from 'react-countup';

import 'bootstrap/dist/css/bootstrap.min.css';

import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Form from 'react-bootstrap/Form';
// import CardColumns from "react-bootstrap/CardColumns";
import axios from "axios";
import Columns from "react-columns";



function App() {
  const [latest, setLatest] = useState([]);
  const [results, setResults] = useState([]);
  const [searchCountries, setSearchCountries] = useState("");

  useEffect(() =>{
    axios
      .all([
        axios.get("https://disease.sh/v3/covid-19/all"),
        axios.get("https://disease.sh/v3/covid-19/countries")
      ])
      .then(res =>{
      
      setLatest(res[0].data);
      setResults(res[1].data);
      })
      .catch(err =>{
      console.log(err);
      });
  }, []);

  const date = new Date(parseInt(latest.updated));
  const lastUpdated = date.toString();

  const filterCountries = results.filter(item =>{
    return searchCountries !== "" ? item.country.includes(searchCountries) : item;
  })


  const countries = filterCountries.map((data, i) =>{
    return(
      <Card key={i} bg="light" text="dark" className="text-center" style={{margin:"10px"}}>
            <Card.Img variant="top" src={data.countryInfo.flag} />
            <Card.Body>
            
              <Card.Title> {data.country} </Card.Title>
              <Card.Text> Cases: <CountUp start={0} end={data.cases} duration={2} separator="," /> </Card.Text>
              <Card.Text> Recovered: <CountUp start={0} end={data.recovered} duration={2} separator="," /> </Card.Text>
              <Card.Text> Deaths: <CountUp start={0} end={data.deaths} duration={2} separator="," /> </Card.Text>
              <Card.Text> Today's Cases: <CountUp start={0} end={data.todayCases} duration={2} separator="," /> </Card.Text>
              <Card.Text> Today's Deaths: <CountUp start={0} end={data.todayDeaths} duration={2} separator="," /> </Card.Text>
              <Card.Text> Active: <CountUp start={0} end={data.active} duration={2} separator="," /> </Card.Text>
            </Card.Body>
          </Card>)
  });

  

  // for react-columns
  var queries = [{
    columns: 2,
    query: 'min-width: 500px'
  }, {
    columns: 3,
    query: 'min-width: 1000px'
  }];

  return (
    <div className="App">
      <img src={coroImg} className="image" alt ="COVID" />
      {/* <h2 style ={{textAlign: "center"}}> Covid-19 Live Stats </h2> */}
      <div className="global">
        <CardDeck>
            <Card bg="secondary" text="white" className="text-center" style={{margin:"10px"}}>
              {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
              <Card.Body>
                <Card.Title> Cases </Card.Title>
                <Card.Text>
                  <CountUp start={latest.cases} end={latest.cases} duration={0.5} separator="," /> 
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small>Last updated {lastUpdated}</small>
              </Card.Footer>
            </Card>

            <Card className="text-center" bg="success" text="white" style={{margin:"10px"}}>
              {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
              <Card.Body>
                <Card.Title>Recovered</Card.Title>
                <Card.Text>
                <CountUp start={latest.recovered} end={latest.recovered} duration={0.5} separator="," />
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small> Last updated {lastUpdated} </small>
              </Card.Footer>
            </Card>

            <Card className="text-center" bg="danger" text="white" style={{margin:"10px"}}>
              <Card.Body>
                <Card.Title> Deaths </Card.Title>
                <Card.Text>
                <CountUp start={latest.deaths} end={latest.deaths} duration={1} separator="," />

                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small> Last updated {lastUpdated} </small>
              </Card.Footer>
            </Card>
        </CardDeck>
      </div>
      <Form>

        <Form.Group controlId="formBasicSearch">
          <Form.Label>Search:</Form.Label>
          <Form.Control 
           type="text" 
           placeholder="Search a country (Please input first letter in caps)"
           onChange = {e => setSearchCountries(e.target.value)}
           autocomplete ="off"
          />
        </Form.Group>
        
      </Form>

      <Columns queries={queries}>
      
      {countries}
      </Columns>
      
    </div>
  );
}

export default App;
