import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// const cors = require('cors');
// const corsOptions ={
//   origin:'http://localhost:3000', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
// App.use(cors(corsOptions));



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);



