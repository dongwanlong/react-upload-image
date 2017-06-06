import React from 'react';
import ReactDOM from 'react-dom';
import ReactUploadImage from '../lib/index';

class App extends React.Component{
    constructor() {
        super();
    }
    render() {
        return (
          <div className="container">
            <ReactUploadImage fileCount={8} beforeUpload={()=>{return true;}} fileChange={()=>{}}/>
          </div>
        )
    }
};

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<App />, app);