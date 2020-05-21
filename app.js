const express = require('express');
const app = express();
const morgan = require('morgan');
const tagsRoutes = require('./routes/tags');
const messageRoutes = require('./routes/messages');
// const specificOfferRoutes = require('./routes/singleoffer');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('tiny'));


app.use('/tags', tagsRoutes);
app.use('/messages', messageRoutes);
// app.use('/', specificOfferRoutes);



app.use((req, res, next) => {
  let errr =  new Error('Not Found!!');
  errr.status = 404
  next(errr)
})

if (app.get('env' === 'development')) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}
const PORT = 7000

app.listen(PORT, ()=> {
  console.log(`Server Started at ${PORT}`);  
});