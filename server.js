require('dotenv').config(); // the .config method reads the .env file each time you start the server 
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet'); // hides info! https://github.com/helmetjs/helmet#how-it-works
const cors = require('cors');
const POKEDEX = require('./pokedex.json');
const app = express();
const morganSetting = process.env.NODE_ENV === 'production' 'tiny' : 'common';

app.use(morgan('morganSetting')); // 'use' is universally setting up the app to use morgan calling the 'dev' argument
app.use(cors()); // for cross origin pre-flight request from a different port
app.use(helmet());

app.use(function validateBearerToken(req, res, next) { // 'use' is univerally or globally setting up the middleware to be used with each RESTFUL action
	const apiToken = process.env.API_TOKEN;
	const authToken = req.get('Authorization');
	if( !authToken || authToken.split(' ')[1] !== apiToken){
		return res.status(401).json({ error: 'Unauthorized request' })
	}
	// move to the next middleware with next call:
	next();
});


const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

function handleGetTypes(req, res){
  res.json(validTypes)
}

app.get('/types', handleGetTypes);


function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon; // our data property 'pokemon'
	const { name, type } = req.query; // the query string KEYS used: name and type

	if(name) { // if there IS a key name
    response = response.filter(pokemon => 
    	pokemon.name.toLowerCase().includes( name.toLowerCase() )
    )
	}

	if(type) { // if there IS a key type
    response = response.filter(pokemon => 
    	pokemon.type.includes( type )
    )
	}
	res.json(response);
}

app.get('/pokemon', handleGetPokemon);

app.use( (error, req, res, next) => {
	let response;
	if(process.env.NODE_ENV === 'production') {
		response = { error: { message: 'server error'}}
	} else {
		response = { error }
	}
	res.status(500).json(response)
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});

