import React, { useState, useEffect } from 'react';
import './App.css';
import {Button, ConfigProvider, Row, Col, notification, Alert } from "antd";
import Modal from './Modal.js';
import Backdrop from './Backdrop';
import { MapContainer, TileLayer, useMap, Popup, Marker} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
function App() {
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const key = 'updatable';
  const [api, contextHolder] = notification.useNotification();
  const [Output, setOutput] = useState("");
  const [Input, setInput] = useState("");
  const myHeaders = new Headers();

  let [city, setcity] = useState("Will be shown"); //Initial state set to a message so that notification looks appropriate
  let [country, setcountry] = useState("here");
  let [hotel1, sethotel1] = useState("");
  let [hotel2, sethotel2] = useState("");
  let [hotel3, sethotel3] = useState("");
  let [rest1, setrest1] = useState("");
  let [rest2, setrest2] = useState("");
  let [rest3, setrest3] = useState("");
  let [tripplan, settripplan] = useState("");
  let [imageLink, setImageLink] = useState("");
  let [long, setlong] = useState("");
  let [lat, setlat] = useState("");


  var requestOptions2 = {
    method: 'GET',
    redirect: 'follow'
  };
  const pass = "" //key for open AI API

  function resultGenerator() {
    setModalIsOpen(true);
  }
  function closeModalHandler() {
    setModalIsOpen(false);
  }

  const openNotification = () => {
    api.open({
      message: 'Your location is being generated....',
      description:
        '',
        duration: 10

    });
  };
  
//button on click function
  const handleSubmit = (event) => {
    openNotification(); //show notification to user
    event.preventDefault();
    console.log(Input)
    const myHeaders = new Headers();
    myHeaders.append("OpenAI-Organization", "org-SFF4dOYJPTzfqs1ZmjPhWobr");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${pass}`);

    //open AI API implementation
    const raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": `You will Respond with 1 city. 
          Your goal is to give a location based on what the user wants, or likes doing or what they desire. 
          You will give them a location for their perfect vacation. For the location, 
          you will give 3 hotes, and three restaurants in that location. Lastly, you will provide a short description of the trip in the last segment. 
        Please generate a response (format shown below) for every description no matter what and if a city is inputted include that city with hotels and restaurants in that city. If a country is inputted find a city in that country. 
          
          (I need to parse the data that is why I need it in this specific format, make sure you dont add extra stuff/words): 
       Desired output Format:
      
       City, Country, Hotel 1, Hotel 2, Hotel 3, Restaurant 1, Restaurant 2, Restaurant 3: Trip plan (estimate cost (give a number) say the hotels to stay at what to eat and where to go)
          Make sure to add a comma before the trip plan so i can use string split for my coding project
        Output example:
        Reykjavik, Iceland, Frost & Fire Hotel, Hotel Ranga, Hotel Holt, Grillmarket, Snaps Bistro, Dill: Experience a winter wonderland in Reykjavik, Iceland. Stay at the cozy Frost & Fire Hotel or the luxurious Hotel Ranga for breathtaking mountain views and warm hospitality. Indulge in a delicious meal at Grillmarket, known for its grilled meat and seafood, or savor traditional Icelandic dishes at Snaps Bistro. For a unique culinary experience, visit the Michelin-starred restaurant Dill. Don't forget to explore the stunning mountains and snowy landscapes surrounding the city. Cost is $4000.
        NOTE: BEFORE THE TRIP PLANNING STARTS, ADD A COLON TO SEPERATE FOR DISTINCTION  
       NOTE: BEFORE THE TRIP PLANNING STARTS, ADD A COLON TO SEPERATE FOR DISTINCTION  

       NOTE: BEFORE THE TRIP PLANNING STARTS, ADD A COLON TO SEPERATE FOR DISTINCTION  

        `
        },
        { 
          "role": "user",
          "content": `${Input}`
        }
      ],
    });
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
//getting and parsing data from open AI api
    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then(response => response.json())
    .then(result => {
     
      console.log(result.choices[0].message.content)
      let temp = result.choices[0].message.content
      console.log(temp)
      let arraytemp = temp.split(',') 
      let arraytemptripplan = temp.split(':')
      console.log(arraytemptripplan)
      console.log(arraytemp)
      setcity(arraytemp[0]) //Output is in this format: City, Country.... allowing temp.split
      setcountry(arraytemp[1])
      console.log(city)
      console.log(country)
      sethotel1(arraytemp[2])
      sethotel2(arraytemp[3])
      sethotel3(arraytemp[4])
      setrest1(arraytemp[5])
      setrest2(arraytemp[6])
      setrest3(arraytemp[7])

      settripplan(arraytemptripplan[1]) 
      
      console.log(tripplan)
    
     

    
    }
    
    )
    .catch(error => {
      console.log('error', error)
    });

  }

  useEffect(() => { //When city state and country states are updated run this function
    if (city && country) {
     

//unsplash image api implementation
      var requestOptions1 = {
        method: 'GET',
        redirect: 'follow'
      };
      api.open({
        message: `Your location: ${city} ${country}`,
        description:
          ``,
          duration: 10
      });
      fetch(`https://api.unsplash.com/search/photos?page=1&query=${city} ${country}&client_id=`, requestOptions1)
        .then(response => response.json())
        .then(result =>
           setImageLink(result.results[0].urls.small),
           console.log(requestOptions1)
           
           )
  
        .catch(error => console.log('error', error));
    }

    var myHeaders = new Headers();
myHeaders.append("X-Api-Key", ""); //api key

    
    //geocoding api implementation
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, requestOptions)
  .then(response => response.json())
  .then(result =>  {setlat(result[0].latitude)
    setlat(result[0].latitude)
    setlong(result[0].longitude)
  
  }
  
  
  
  )
  .catch(error => console.log('error', error));
  }, [city, country]);

  //for leaflet api - loading scripts on page load
  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    // script.integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossorigin= "";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.crossorigin= "";
    head.appendChild(link);

    return () => { head.removeChild(link); }

  }, []);

  return (
    <body className='new'>
    <div>
    <header>
      <div>
          <h1>TravelTrove</h1>
      </div>
    </header>
    <main>
      
      <div className='description'>
        <p>We've all experienced the frustration of having the ideal food, restaurant, clothes, movie, or vacation spot on our minds, but struggling to define it. With our app, even a simple or detailed description can trigger AI-generated suggestions. This app addresses the difficulties in finding hotels and restaurants while also integrating a budget component to make dream vacations accessible to everyone.</p>
      </div>
      {/* <h2>Describe Your Desired Destination:</h2> */}
      <div className='pad'>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className='input'
            style={{ width: '1000px', height: '40px' }}
            type="text"
            value={Input}
            placeholder="Describe Your Desired Destination"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
                {contextHolder}

          <button className='submit' type="submit" onClick={resultGenerator}>Generate</button>
        </form>
        <br></br>
        <br></br>
        </div>
        {modalIsOpen && <Modal
        imageLink = {imageLink}
        tripPlan = {tripplan}
        />}
        {modalIsOpen && <Backdrop onCancel={closeModalHandler} />}
        
    </main>
<div className='mapContainer'> 
    <MapContainer
      center={[lat, long]}
      zoom={2.2}
      style={{ height: 500, width: "100%", marginTop: "30px"}}
    >
      
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
<Marker position={[lat, long]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >
      <Popup>
        Your location
      </Popup>
    </Marker>
    </MapContainer>
    </div>
  </div>
  </body>
  
  );
}

export default App;


