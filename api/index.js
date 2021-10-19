const express = require('express')
const path = require('path')
const db = require('./dbs/database')
const moves = require('./dbs/moves')

const PORT = process.env.PORT || 5000

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.send('Get ready poke NFT!');
})

app.get('/api/token/:token_id', function(req, res) {
  const tokenId = parseInt(req.params.token_id).toString()
  const poke = db[tokenId]
  const attributes = moves[tokenId]
  const data = {
    'name': poke.name,
    'image': poke.image,
    'description': poke.description,
    'damage': attributes.damage,
    'skill': attributes.move,
    'skill_description': attributes.description
  }
  res.send(data)
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})