require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();

console.log(process.env.API_TOKEN);

app.use(morgan('dev'));

app.use((req,res) =>{
	res.send("hey there!");
})

app.use(function validateBearerToken(req, res, next) {
	console.log('validate bearer token middleware')
	debugger
	// move to the next middleware
	next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res){
  res.json(validTypes)
}
app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
  res.send('Hello, Pokemon!')
}
app.get('/pokemon', handleGetPokemon);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})