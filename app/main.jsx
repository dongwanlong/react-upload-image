import React from 'react';
import ReactDOM from 'react-dom';
import ReactUploadImage from './react-upload-image/react-upload-image';

class App extends React.Component{
    constructor() {
        super();
    }
    render() {
        return (
          <div className="container">
            <ReactUploadImage count={4} beforeUpload={()=>{return true;}} fileChange={()=>{}}/>
          </div>
        )
    }
};

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<App />, app);