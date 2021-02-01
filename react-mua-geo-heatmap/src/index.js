import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import GeoHeatmap from "./component/GeoHeatmap";

ReactDOM.render(
  <React.StrictMode>
    <GeoHeatmap
        height={window.innerHeight}
        width={window.innerWidth}
        data={
        [
            [100,40,25],
            [100,50,25],
            [3,5,10],
            [200,175,25],
            [200,190,15],
            [200,200,25]
        ]
    } />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
