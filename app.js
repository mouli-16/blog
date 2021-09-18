const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const port = process.env.PORT || 3000;
const app = express();
const dotenv = require("dotenv");

// middleware
app.use(express.static('public'));
app.use(express.json());

dotenv.config();

// view engine
app.set('view engine', 'ejs');

// database connection

mongoose.connect(process.env.dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);


app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.post('/blogs',(req,res) => {
const blog = new Blog(req.body)
blog.save()
.then((result)=>{
  res.redirect('/blogs')
})
.catch((err)=>{
  console.log(err)
})
})

// blog routes
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/blogs',(req,res)=>{
  Blog.find().sort({createAt:-1})
  .then((result)=>{
    res.render('index', {title:'All Blogs', blogs: result})
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/blogs/:id',(req,res)=>{
  const id = req.params.id
  Blog.findById(id)
  .then(result =>{
    res.render('details',{ blog: result, title: 'Blog Details'})
  })
  .catch(err =>{
    console.log(err)
  })
})


// mongoose and mongo sandbox routes
app.get('/add-blog',(req,res)=>{
   const blog = new Blog({
     title: 'new blog2',
     snippet: 'about my new blog',
     body: 'more about my new blog'
   })

   blog.save()
   .then((result) =>{
     res.send(result)
   })
   .catch((err) =>{
     console.log(err)
   })
})
app.get('/all-blogs',(req,res)=>{

   Blog.find()
   .then((result) =>{
     res.send(result)
   })
   .catch((err) =>{
     console.log(err)
   })
})
app.get('/single-blog',(req,res)=>{

   Blog.findById('6108adb8a166031b58604091')
   .then((result) =>{
     res.send(result)
   })
   .catch((err) =>{
     console.log(err)
   })
})

app.delete('/blogs/:id',(req,res)=>{
  const id = req.params.id

  Blog.findByIdAndDelete(id)
  .then(result =>{
     res.json({redirect: '/blogs'})
  })
  .catch(err =>{
    console.log(err)
  })
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});