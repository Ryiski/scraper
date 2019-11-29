var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio')
const fs = require('fs');
const data = require('../data.json');
const url = require('url');

router.get('/', async (req, res, next) => {
  res.render('index', { data });
});


router.post('/addUrl',async (req, res, next) => {

  const { previewUrl, id } = req.body;
  
  try{

    const resp = await fetch(previewUrl);
    const html = await resp.text();
    const $ = cheerio.load(html);


    const metaTags = {
      id,
      url: previewUrl,
      domain: url.parse(previewUrl).hostname,
      title: $('meta[property="og:title"]').attr('content') || $('h1').text() || $('title').text() || 'No Title Available',
      img: $('meta[property="og:image"]').attr('content') || './images/no-image.png',
      description: $('meta[property="og:description"]').attr('content') || $('p').text() || 'No description available',
      favicon: $('link[rel="shortcut icon"]').attr('href'),
    }

    let { description } = metaTags;

    //avoiding description to be more then 212 chars
    if(description .length > 212){
      metaTags.description = description.substring(0,212) + '...';
    }

    //add to start of array
    data.unshift(metaTags);

    //rewrite it to data.json
    fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
    
    //respond back with the new added data
    res.status(201).json(data.shift());

  }catch(err){

    console.log(err);
    res.status(400).end();
    
  }

});

router.post('/remove/:id', (req, res) => {

  const id = req.params.id;

  const datasId = data.map(d => d.id);

  const index = datasId.indexOf(id);

  data.splice(index,1);

  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

  res.status(200).end();

})




module.exports = router;
