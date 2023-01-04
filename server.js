//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const { JsonCalendar } = require('json-calendar')
const calendar = new JsonCalendar()

//..............Create an Express server object..................//
const app = express();

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());
app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library

//.............Define server routes..............................//
//Express checks routes in the order in which they are defined

app.get('/', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index");
});



app.get('/results', function(request, response) {

      let categories = JSON.parse(fs.readFileSync('data/toDo.json'));

      //accessing URL query string information from the request object
      let categoryCreate = request.query.categoryCreate;
      let activityCreate = request.query.activityCreate;
      if(categories[categoryCreate]){
        let activities={};

      activities["category"]= categoryCreate;
      activities["activity"]= activityCreate;

      categories[categoryCreate] = activities;

      //update toDo.json to permanently remember results
      fs.writeFileSync('data/toDo.json', JSON.stringify(activities));

      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render("results", {
        data: results
      });
    }else{
      response.status(404);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"404"
      });
    }
});


app.get('/Category/specific/:CategorySpecific', function(request, response) {
  let opponents = JSON.parse(fs.readFileSync('data/toDo.json'));

  // using dynamic routes to specify resource request information
  let opponentName = request.params.CategorySpecific;
  console.log(opponentName);
  if(opponents[opponentName]){
    console.log("h");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("CategorySpecific",{
      opponent: opponents[opponentName]
    });

  }else{
    response.status(404);
    response.setHeader('Content-Type', 'text/html')
    response.render("error", {
      "errorCode":"404"
    });
  }
});

app.post('/CategoryCreate', function(request, response) {
    let opponentName = request.body.opponentName;
    let opponentPhoto = request.body.opponentPhoto;
    if(opponentName&&opponentPhoto){
      let opponents = JSON.parse(fs.readFileSync('data/toDo.json'));
      let newOpponent={
        "name": opponentName,
        "photo": opponentPhoto,
        "win":0,
        "lose": 0,
        "tie": 0,
      }
      opponents[opponentName] = newOpponent;
      fs.writeFileSync('data/toDo.json', JSON.stringify(opponents));
      response.redirect("/Category/specific/"+opponentName);
    }else{
      console.log('ERROR');
      response.status(400);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"400"
      });
    }
      console.log(JSON.parse(fs.readFileSync('data/toDo.json')));
});
app.get('/Category', function(request, response) {
    let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("Category", {
      data: categories
    });
});

app.get('/CategoryCreate', function(request, response) {
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("CategoryCreate");
});



// Because routes/middleware are applied in order,
// this will act as a default error route in case of
// a request fot an invalid route
app.use("", function(request, response){
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode":"404"
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});
