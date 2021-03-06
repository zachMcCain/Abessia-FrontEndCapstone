//dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Axios from 'axios';
import styled from 'styled-components';

//components
import Main from './components/mainImage.jsx';
import Info from './components/informationBar.jsx';
import Left from './components/leftButton.jsx';
import Right from './components/rightButton.jsx';
import Previews from './components/previewImages.jsx';
//import Zoom from './components/zoomBox.jsx';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 85px 85px 85px 85px 85px 85px 85px 85px 85px 85px 85px 85px 85px;
  grid-template-rows: 85px 85px 85px 85px 85px 85px 85px 85px;
  grid-gap: 2px;
`;

const Item = styled.div`
  font-size: 18px;
  text-align: center;
`;

const MainImage = styled(Item)`
  grid-area: main-image;
  grid-column: 1 / 8;
  grid-row: 1 / 8;
`;

const LeftButton = styled(Item)`
  grid-area: left-button;
  grid-column: 1;
  grid-row: 8;
`;

const RightButton = styled(Item)`
  grid-area: right-button;
  grid-column: 7;
  grid-row: 8;
`;

const PreviewImageBar = styled(Item)`
  grid-area: preview-image-bar;
  grid-column: 2 / 7;
  grid-row: 8;
`;

const Blank = styled(Item)`
  grid-area: blank;
  grid-column: 8 / 13;
  grid-row: 8 / 9;
`;

const ZoomImage = styled(Item)`
  grid-area: zoom-image;
  grid-column: 8 / 13;
  grid-row: 1 / 8;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.retrieveData = this.retrieveData.bind(this);
    this.parseData = this.parseData.bind(this);
    this.updateMainImage = this.updateMainImage.bind(this);

    this.state = {
      data: null,
      currentID: 3,  //default to 1 for dummy data
      currentColor: 0, //default to 0 for dummy data
      currentColorObject: null,
      currentImage: null,
      currentDescr: null,
      currentProduct: null,
      currentImageSet: null,
      currentImgIndex: 1, //defaults to 1
    };
  }

  componentDidMount() {
    this.retrieveData((error, unparsedData) => {
      this.parseData(unparsedData);
    });
  }

  retrieveData(callback) {
    Axios.get('/api/products/photos')
      .then(res => {
        if (res === null || res === undefined) {
          let empty = 'retrieveData returned an empty response from the database'
          console.error(empty);
          callback(empty);
        } else {
          callback(null, res.data);
        }
      })
      .catch(err => {
        console.error('Error in retrieveData(): ' + err);
        return;
      });
  }

  parseData(unparsedData) {
    var parsedData = [];
    for (let i = 0; i < unparsedData.length; i++) {
      let currentObj = unparsedData[i];
      let parsedColors = JSON.parse(currentObj.colors);
      let newObj = {
        id: currentObj.id,
        name: currentObj.name,
        company: currentObj.company,
        price: currentObj.price,
        colors: parsedColors
      }
      parsedData.push(newObj);
    }

    var index = this.state.currentID - 1;
    var curImgSet = parsedData[index].colors[this.state.currentColor].pictures;
    var curColObj = parsedData[index].colors[this.state.currentColor];
    var curImg = curImgSet[0].image;
    var curDescr = curImgSet[0].description;

    this.setState({
      data: parsedData,
      currentProduct: parsedData[index],
      currentImage: curImg,
      currentDescr: curDescr,
      currentImageSet: curImgSet,
      currentColorObject: curColObj
    });
  }

  updateMainImage(index) {
    var newImg = this.state.currentImageSet[index].image;
    var newDescr = this.state.currentImageSet[index].description;
    this.setState({
      currentImage: newImg,
      currentDescr: newDescr,
      currentImgIndex: index + 1
    });
  }

  render() {
    if (this.state.currentProduct === null) {
      return (
        <div>Product is Null</div>
      );
    } else {
      console.log(this.state.currentImage);
      return (
        <div>
          <Grid className="grid-container">
            <MainImage className="grid-item">
              <Main picture={this.state.currentImage} description={this.state.currentDescr}/>
            </MainImage>
            <ZoomImage className="grid-item">
            </ZoomImage>
            <LeftButton className="grid-item">
              <Left/>
            </LeftButton>
            <PreviewImageBar className="grid-item">
              <Previews images={this.state.currentImageSet} updateMain={this.updateMainImage}/>
            </PreviewImageBar>
            <RightButton className="grid-item">
              <Right/>
            </RightButton>
            <Blank className="grid-item"></Blank>
          </Grid>
          <Info color={this.state.currentColorObject} index={this.state.currentImgIndex}/>
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));