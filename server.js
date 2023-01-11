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

app.get('/Stats', function(request, response) {
  let stats = JSON.parse(fs.readFileSync('data/stats.json'));
  let data = JSON.parse(fs.readFileSync('data/toDo.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("stats", {
  data: stats,
  categories: data
  });
});

app.post('/Stats/:day', function(request, response) {
    let todo = request.body.option1;
    let progress = request.body.option2;
    let overdue = request.body.option3;
    let complete = request.body.option4;
    let day = request.params.day;
    if (todo || progress || overdue || complete) {
      let stats = JSON.parse(fs.readFileSync('data/stats.json'));
      if (todo) {
    stats[day]["To-Do"] += 1;
  }
    if (progress) {
    stats[day]["In-Progress"] += 1;
  }
    if (overdue) {
    stats[day]["Overdue"] +=1;
}
  if (complete) {
    stats[day]["Completed"] +=1;
  }

      fs.writeFileSync('data/stats.json', JSON.stringify(stats));
      response.redirect("/stats");
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


app.get('/EditCategory/:category', function(request, response) {
  let data = JSON.parse(fs.readFileSync('data/toDo.json'));
  let category = request.params.category;
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("categoryEdit", {
  data: data,
  category: category
  });
});

app.post('/EditCategory/:category', function(request, response) {
    let categoryName = request.body.categoryName;
    let category = request.params.category;
    if(categoryName){
      let categories = JSON.parse(fs.readFileSync('data/toDo.json'));
      for (days in categories) {
        if (category != categoryName) {
    categories[days][categoryName] = categories[days][category];
    delete categories[days][category];
  }
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

app.get('/EditActivity/:day/:category/:activity', function(request, response) {
  let data = JSON.parse(fs.readFileSync('data/toDo.json'));
  let activity= request.params.activity;
  let category = request.params.category;
    let day = request.params.day;
    if (activity)
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("ActivityEdit", {
  data: data,
  activity: activity,
  day: day,
  category: category
  });
});

app.get('/EditActivity/:day/:category/', function(request, response) {
  let data = JSON.parse(fs.readFileSync('data/toDo.json'));
  let category = request.params.category;
    let day = request.params.day;
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("ActivityEdit", {
  data: data,
  activity: "",
  day: day,
  category: category
  });
});

app.post('/EditActivity/:day/:category/', function(request, response) {
    let activity= request.body.activityName;
    let category = request.params.category;
      let day = request.params.day;
    if(activity){
      let data = JSON.parse(fs.readFileSync('data/toDo.json'));
    data[day][category] = activity;
      fs.writeFileSync('data/toDo.json', JSON.stringify(data));
      response.redirect("/");
    } else{
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


app.post('/EditActivity/:day/:category/:activity', function(request, response) {
    let activity= request.body.activityName;
    let category = request.params.category;
      let day = request.params.day;
    console.log(activity);
    if(activity){
      let data = JSON.parse(fs.readFileSync('data/toDo.json'));
    data[day][category] = activity;
      fs.writeFileSync('data/toDo.json', JSON.stringify(data));
      response.redirect("/");
    } else{
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

app.get('/Delete/:category', function(request, response) {
  console.log("delete");
    let category = request.params.category;
      let data = JSON.parse(fs.readFileSync('data/toDo.json'));
      for(day in data){
  delete data[day][category];
  }
      fs.writeFileSync('data/toDo.json', JSON.stringify(data));
      response.redirect("/");
});

  app.get('/Reset', function(request, response) {
    console.log("HERE");
  let data = JSON.parse(fs.readFileSync('data/toDo.json'));
  let stats = JSON.parse(fs.readFileSync('data/stats.json'));
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  for (day in data) {
  for (categories in data[day]) {
  data[day][categories] = "";
  console.log(data);
  }
  }
  for (day in stats) {
  for (categories in stats[day]) {
  stats[day][categories] = 0;
  }
  }
   fs.writeFileSync('data/toDo.json', JSON.stringify(data));
   fs.writeFileSync('data/stats.json', JSON.stringify(stats));
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
