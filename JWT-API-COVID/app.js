const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
var request = require('request');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://akshith123:akshith123@cluster-os.jv4j8.mongodb.net/jwt-auth-system';
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then((result) =>
		app.listen(3000, function() {
			console.log('Covid Stats has been started at port 3000');
		})
	)
	.catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/Single-Country', requireAuth, (req, res) => res.render('single-country'));

app.get('/results', requireAuth, function(req, resp) {
	var country = req.query.country;
	// var province = req.query.province;
	var url = 'https://corona.lmao.ninja/v2/countries/' + country + '?yesterday=true&strict=true&query';
	// var url = 'https://covid-api.com/api/reports?region_name=' + country + '&region_province=' + province;
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var parsedData = JSON.parse(body);
			resp.render('search-results', { parsedData: parsedData });
			// console.log(parsedData);
		}
	});
});

app.get('/Multiple-Country', requireAuth, (req, res) => res.render('multiple-country'));

app.get('/results1', requireAuth, function(req, resp) {
	var countries = req.query.countries;
	var url = 'https://corona.lmao.ninja/v2/countries/' + countries + '?yesterday';
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var parsedData = JSON.parse(body);
			resp.render('search-results1', { parsedData: parsedData });
			console.log(parsedData);
		}
	});
});
app.use(authRoutes);
