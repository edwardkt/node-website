	var express = require('express');

	var app = express();

	app.use(express.static(__dirname + '/public'));

	// set up handlebars view engine
	var handlebars = require('express-handlebars').create({
	    defaultLayout:'main',
	    helpers: {
	        section: function(name, options){
	            if(!this._sections) this._sections = {};
	            this._sections[name] = options.fn(this);
	            return null;
	        }
	    }
	});
	app.engine('handlebars',handlebars.engine);
	app.set('view engine', 'handlebars');

	app.use(require('body-parser').urlencoded({ extended: true }));

	// set port to 3000
	app.set('port', process.env.PORT || 3000);

	// redirected page after user signs up successfully
	app.get('/thank-you', function(req, res){
		res.render('thank-you');
	});

	// page to sign up for newsletter
	app.get('/newsletter', function(req, res){
	    res.render('newsletter', { csrf: 'CSRF token goes here' });
	});

	// posting form data to URL
	app.post('/process', function(req, res){
	    if(req.xhr || req.accepts('json,html')==='json'){
	        // if there were an error, we would send { error: 'error description' }
	        res.send({ success: true });
	    } else {
	        // if there were an error, we would redirect to an error page
	        res.redirect(303, '/thank-you');
	    }
	});

	// grab data from getWeatherData and display to home page
	app.use(function(req,res,next){
		if(!res.locals.partials) res.locals.partials = {};
		res.locals.partials.weatherContext = getWeatherData();
		next();
	});

	// Home page
	app.get('/', function(req,res){
		res.render('home');
	});

	// About Page
	app.get('/about', function(req,res){
		res.render('about');
	});

	//custom 404 page
	app.use(function(req, res){
		res.status(404);
		res.render('404');
	});

	// custom 500 page
	app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
	});

	app.listen(app.get('port'), function(){
		console.log( 'Express started on http://localhost:' +
			app.get('port') + '; press Ctrl-C to terminate.');
	});

	// mocked weather data
	function getWeatherData(){
	    return {
	        locations: [
	            {
	                name: 'Portland',
	                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
	                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
	                weather: 'Overcast',
	                temp: '54.1 F (12.3 C)',
	            },
	            {
	                name: 'Bend',
	                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
	                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
	                weather: 'Partly Cloudy',
	                temp: '55.0 F (12.8 C)',
	            },
	            {
	                name: 'Manzanita',
	                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
	                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
	                weather: 'Light Rain',
	                temp: '55.0 F (12.8 C)',
	            },
	        ],
	    };
	}