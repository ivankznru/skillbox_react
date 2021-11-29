import express from 'express';
import ReactDOM from 'react-dom/server';
import { App } from '../App';
import { indexTemplate } from './indexTemplate';
import axios from 'axios';

const app = express();

app.use('/static', express.static('./dist/client'));  // route for static files

app.get('/', (req, res) => {
  res.send(
    indexTemplate(    // template would send from server
      ReactDOM.renderToString(App())
    ),
  );
});

app.get('/auth', (req, res) => {
  axios.post(
    'https://www.reddit.com/api/v1/access_token',  // url
    `grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://localhost:3000/auth`,  // data
    {    // config
      auth: { username: process.env.CLIENT_ID, password: process.env.REDDIT_SECRET },
      headers: { 'Content-type': 'application/x-www-form-urlencoded' }
    }
  )
    .then(({data}) => {
      // req.query.code;
      res.send(
        indexTemplate(    // template would send from server
          ReactDOM.renderToString(App()),
          data['access_token']
        ),
      );
    })
    .catch(console.log());
});

app.listen(3000, () => {
  console.log('Servers started on http://localhost:3000');
});
