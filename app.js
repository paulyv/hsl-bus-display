var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const cron = require('node-cron');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// WEB CRAWLER

// const URL = "https://reittiopas.hsl.fi/pysakit/HSL:2215221";

const URL = "https://reittiopas.hsl.fi/pysakit/HSL:2215221";
fetchSchedule();

cron.schedule("15 0 * * *", () => {
  console.log(`this message logs every day @ 00:15`);
  fetchSchedule();
});

function fetchSchedule() {

  request(URL, function (err, res, body) {
    let arr = [];
    let jsonfile = '';

      if(err)
      {
          console.log(err, "error occured while hitting URL");
      }
      else
      {

        let $ = cheerio.load(body);
         $('#mainContent > div > div.main-content > div.scrollable-content-wrapper > div.stop-page-content-wrapper > div.stop-scroll-container.momentum-scroll > div > a').each(function(index){

              let line = $(this).find('span.route-number').text()
              let time = $(this).find('span.time').text();
              let destination = $(this).find('span.route-destination').text();
              if(time === 'Nyt') {
                time = '0 min';
              }
              const obj = {
                  line : line,
                  destination : destination,
                  time : time
              };
              arr.push(obj);
              jsonfile = JSON.stringify(arr);

         })
         console.log(jsonfile);

         fs.writeFile('./public/json/schedule.json', jsonfile, function (err) {
              if(err) {
                  console.log(err);
              }
                  else{
                      console.log("schedule saved successfully.");
                  }
          });
      }
  });

}




module.exports = app;
