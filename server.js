const PORT = 8000;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(express.json());
app.use(cors());



const API_KEY = process.env.OPEN_API_KEY;
const API_URL = process.env.OPEN_API_URL;

app.post('/completions', async(req, res)=>{

    const options = {
        method:'POST',
        headers:{
            Authorization : `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role:'user', content: req.body.message}],
            max_tokens:100,
        })
    }


    try {
       const response = await fetch(API_URL, options);
       const data = await response.json();
       res.send(data);
    } catch (error) {
        console.log('error', error);
    }
})

app.listen(PORT, ()=> console.log('server is running at port  ' + PORT))