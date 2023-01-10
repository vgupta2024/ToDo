//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
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
  let days = JSON.parse(fs.readFileSync('data/toDo.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index", {
  data: days
  });
});

  app.get('/Reset', function(request, response) {
    console.log("HERE");
  let data = JSON.parse(fs.readFileSync('data/toDo.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  for (day in data) {
  for (categories in data[day]) {
  data[day][categories] = "";
  console.log(data);
  }
  }
   fs.writeFileSync('data/toDo.json', JSON.stringify(data));
  response.redirect("/");
  });


app.get('/Category/specific/:day/:CategorySpecific', function(request, response) {
  let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
let day = request.params.day;
  // using dynamic routes to specify resource request information
  let categoryName = request.params.CategorySpecific;
  if(categories[day][categoryName]){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("CategorySpecific",{
      opponent: categories[day][categoryName]
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
    let categoryName = request.body.categoryName;
    if(categoryName){
      let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
      for(day in categories){
    categories[day][categoryName] = "";
  }
      fs.writeFileSync('data/toDo.json', JSON.stringify(categories));
      response.redirect("/");
    }else{
      console.log('ERROR');
        let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
      response.status(400);
      response.setHeader('Content-Type', 'text/html')
      response.render("error", {
        "errorCode":"400",
        data: categories
      });
    }
});
    app.post('/Category', function(request, response) {
        let category = request.body.category;
        let activity = request.body.activity;
        let day = request.body.day;
        if(day && category && activity){
        let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
        categories[day][category] += activity + ", ";
          fs.writeFileSync('data/toDo.json', JSON.stringify(categories));
          response.redirect("/");
        }else{
          console.log('ERROR');
          let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
          response.status(400);
          response.setHeader('Content-Type', 'text/html')
          response.render("error", {
            data: categories,
            "errorCode":"400"
          });
        }

});
app.get('/Category', function(request, response) {
    let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("Category", {
      data: categories
    });
});

app.get('/Category/:day', function(request, response) {
  let day = request.params.day;
  let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("CategorySpecific", {
      day: day,
      data: categories
    });
});

app.get('/CategoryCreate', function(request, response) {
  let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("CategoryCreate",  {
        data: categories
      });
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
