
//const http = require( 'http');
const PORT = 4000;
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
// const url = require('url');
// const fs = require("fs");
const passport = require('passport');
const passportLocal = require('./config/passport-local');
const session = require('express-session');
const database = require('./config/mongoose');
const googleStrategy = require('./config/passport-google-oauth');
const MongoStore = require('connect-mongo');
// const Movie = require('./models/movie');
const User = require('./models/user');
const app = express();


// created the app set params
app.set('view engine','ejs');
app.use(express.static('./assets'));
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({ extended : true})); //middleware
app.use(cookieParser()); //middleware


//  created the session for google Auth
app.use(session({
    name : 'login',
    secret : 'xyz',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000 * 60 *100)
    },
    store : MongoStore.create({
        mongoUrl : 'mongodb://localhost:27017/movieDB',
        mongooseConnect : database,
        autoRemove : 'disable'
    }
    )
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// const server = require('http').createServer(app);

// const io = require('socket.io')(server,{cors:{origin:'*'}})

app.get('/signin', function(req,res){
    return res.render('signIn');
})

app.get('/signup', function(req,res){// console.log(req.cookies.name);
    if(req.isAuthenticated()){
        return res.redirect('/profile')
    }
    return res.render('signUp');
})

app.get('/profile',passport.checkAuthentication,function(req,res){
    return res.render('profile');
})

app.get('signout',function(req,res){
    req.logOut();
    return res.redirect('/signin');
})

app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signin'}),
    function(req,res){
        return res.redirect('/profile');
    }
)

app.post('/userCreate', function(req,res){
    if(req.body.password != req.body.confirm_password){
        console.log("password not correct");
        return res.redirect('back');
    }
    
    User.findOne({email : req.body.email}, function(err,user){
        if(err){
            console.log("error found");
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                console.log(req.body);
                if(err){
                    console.log("error found");
                    return;
                }
                return res.redirect('/signin')
            })
        }
        else{
            return res.redirect('back');
        }
    })

})


app.post('/userLogin',
passport.authenticate(
    'local',
    {failureRedirect : '/signup'}
),function(req,res){
    return res.redirect('/profile')
}
)

// app.post('/userLogin',function(req,res){
//     User.findOne({email :  req.body.email},function(err,user){
//         if(err){
//             console.log("error found");
//             return;
//         }
//         if(user){
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }

//             res.cookie('name',user.name);
//             res.redirect('/profile');

//         }
//         else{
//             console.log("email not found")
//             return res.redirect('back');
//         }
//     })
// })




app.listen(PORT,function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is running on Port",PORT)
})






// server.listen(PORT,function(err){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("Server is running on Port",PORT)
// })

// io.on('connection',(socket)=>{
//     console.log('Token',socket.id);
//     socket.on('message',(data)=>{
//         socket.broadcast.emit('message',data);
//     })
// })



// const socket = require('./config/socket').socket(chatServer);
// chatServer.Listen(2000);
// console.log("Server at port 3000");

// // show

// app.get('/',function(req,res){
    
//     Movie.find({}, function(err,movies){
//         if(err){
//             console.log("Error movies")
//             return;
//         }
//         return res.render('index',{Movies : movies})
//     })


// })


// // add movies

// app.post('/addMovies',function(req,res){
//     // console.log(req.body);
//     // let obj = {
//     //     name : req.body.movieName,
//     //     year : req.body.movieYear
//     // }
//     // Movies.push(obj);

//     Movie.create({
//         name : req.body.movieName,
//         year : req.body.movieYear
//     },function(err,newMovie){
//         if(err){
//             console.log("Error in adding movies")
//             return;
//         }
//         console.log("new movie", newMovie);
//         return res.redirect('back');
//     })

// })


// // delete

// app.get('/movieDelete',function(req,res){
    
//     // let movieIndex = Movies.findIndex(value => value.name == req.query.name)
//     // console.log("Index",req.query.name)
//     // if(movieIndex != -1){
//     //     Movies.splice(movieIndex,1);
//     // }

//     Movie.findByIdAndDelete(req.query.id,function(err){
//         if(err){
//             console.log("error is deleting");
//             return;
//         }
//         return res.redirect('back');
//     })



// })


// // update movie

// app.post('/updateMovie',function(req,res){
//     console.log(req.body);
//     Movie.findByIdAndUpdate(req.query.id,req.body,function(err,updateMovie){
//         if(err){
//             console.log("Error in Updating Movie");
//             return;
//         }
//         console.log(updateMovie);
//         return res.redirect('back');
//     })
// })



// app.listen(PORT,function(err){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("Server is running on the port",PORT)
// })




























// var Movies = [
//     {
//         name : 'IronMan-1',
//         year : '2009'
//     },
//     {
//         name : 'MS Dhoni',
//         year : '2016'
//     },
//     {
//         name : 'Avengers',
//         year : '2014'
//     }

// ]


// var myInfo =[{
//     name : "Meena",
//     class : "CSE",
//     email : "meena0252.cse19@chitkara.edu.in"
// },
// {
//     name : "Khushi",
//     class : "CSE",
//     email : "khushi0281.cse19@chitkara.edu.in"
// }]

// myInfo.map((d)=>{
//     console(d.class);
// })

// 1===3 ? console.log("acb") : console.log("xyz");

// if(1===3){
//     console.log("acb")
// }

// else{
//     console.log("xyz")
// }
//middleware

// app.use(function(req,res,next){
//     console.log("Calling 1")
//     next();
// })

// app.use(function(req,res,next){
//     console.log("Calling 2")
//     next();
// })

// app.get('/',function(req,res){
//     return res.render('index',{myInfo : myInfo});

// })

// app.get('/profile',function(req,res){
//     return res.render('profile', {myInfo: myInfo});

// })

// app.listen(PORT,function(err){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("Server is running on the port",PORT)
// })

// Blocking vs Non-Blocking

// Multi-threaded vs Single-threaded

//Snychronous vs Asnychronous
//setTimeout()
// JavaScript ke pass hoti hai callStack 
// C R U D(create read update delete)






// app.get('/profile',function(req,res){
//     console.log("path",__dirname);
//     return res.send(__dirname+'/profile.html');
//     return res.send('<h3>My Profile</h3>');
// })


// function myFirst(req,res){

//     var q = url.parse(req.url, true);
//     console.log("file Name", q.pathname)
//     let filePath = '.' + q.pathname +'.html';
    
//     fs.readFile(filepath, function(err,data){
//         if(err){
//             res.writeHead(404,{'Content-Type': 'text/html'});
//             return res.end("404 Not found")
//         }
//         res.writeHead (280,{'Content-Type': 'text/html'});
//         return res.end(data);
//     });

// }

// const server = http.createServer(myFirst);

// server.listen (PORT, function(err){
//     if(err) {
//         console.log("Error in server")
//         return;
//     }
//     console.log("server is on Port", PORT)
// })
