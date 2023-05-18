import React, {Component} from 'react';
import Navigator from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';




// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id



class App extends Component{
  constructor(){
    super()
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      }
  }
  
  onInputChange= (event) =>{
    this.setState({input:event.target.value})
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number (image.width);
    const height= Number(image.height);
    // console.log(clarifaiFace.left_col * width)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width- (clarifaiFace.right_col*width),
      bottomRow: height-( clarifaiFace.bottom_row*height)
        }
      
    }

    displayFaceBox =(box) =>{
      console.log(box)
      this.setState({box:box})
      
    }
  
  onButtonSubmit =() =>{
    this.setState({imageUrl:this.state.input})
// URL of image to use. Change this to your image.
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

const raw = JSON.stringify({
  "user_app_id": {
    "user_id": "clarifai",
    "app_id": "main"
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": this.state.input
              }
          }
      }
  ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + 'd53656fcf0d24214950419e6aa173c11'
    },
    body: raw
};


    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(response => response.json())
    .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
    .catch(error => console.log('error', error));
    // this.calculateFaceLocation
  
  }
  // .outputs[0].data.clusters.projection
  render(){
    return(
      <div className="App">
      <Navigator/>
        <Logo/>
        <Rank/>
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}/>     
        <FaceRecognition  box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    )
  }
}

export default App;
