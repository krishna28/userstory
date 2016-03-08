var User = require('../models/user');

var Story = require('../models/story');

var config = require('../../config');

var jsonwebtoken =  require('jsonwebtoken');

var secureKey = config.secretkey;

var createToken  = function(user){

   var token = jsonwebtoken.sign({   
    id:user._id,
    name:user.name,
    username:user.password      
    },secureKey,{
        expiresInMinute:1400
    });

return token;
    
}


module.exports = function(app,express){
    
    var api = express.Router();
    
    api.post('/signup',function(req,res){
    
    var user = new User({
        
        name:req.body.name,
        username:req.body.username,
        password:req.body.password
     
    });
        
        user.save(function(err){
        if(err){
        res.send(err);
          return;  
        }else{
        
            res.json({message:"User created successfully"})
        
        }
        });    
    
    });
    
    api.get('/users',function(req,res){
    
        User.find({},function(err,users){
        
        if(err){
            res.send(err);
            return;
        }else{
            res.json(users);
        }
        
        })
    
    
    
    });
    
    
    api.post('/login',function(req,res){
    
    User.findOne({username:req.body.username}).select('password').exec(function(err,user){
    
    if(err){
        throw err;
    }
        if(!user){
        res.send({message:"user not found!"});
        }
        else{
            var isValidPassword = user.comparePassword(req.body.password);
            
            
            if(!isValidPassword){
                res.send({message:"invalid password!"});
            }else{
            
                var token = createToken(user);
                res.json({ 
                    success:true,
                    message:"successfully login!",
                    token:token
                
                });
            
            }
        }
    
    });
        
    });
    
    
    api.use(function(req,res,next){
    
        console.log("middle ware called");
        
        var token = req.body.token || req.headers['x-access-token'];
        
        if(token){
        
            jsonwebtoken.verify(token,secureKey,function(err,decoded){
            
              if(err){
               
                  res.status(403).send({success:false,message:"failed to authenticate"});
              
              }else{
              
              req.decoded = decoded; 
              next();
              }
            });
            
        }else{
        res.status(403).send({success:false,message:"no token provided"});
        }
    });
    

    
    //api chaining
    
    api.route('/')
        
       .post(function(req,res){
    
    
        var story = new Story({
        creator:req.decoded.id,
        content:req.body.content       
        });
        
        story.save(function(err){
        if(err){
         res.send(err);
        }else{
        
        res.json({mesage:"new story created"});
        }
        
        
        });
        
         })
    
       .get(function(req,res){
    
        Story.find({creator:req.decoded.id},function(err,stories){
        
            if(err){
            res.send(err);
            }else{
            
            res.json(stories);
            }
        
        
        });
    
    
    
          });
    
      api.get('/me',function(req,res){
       res.json(req.decoded);
       });
    
    
    
    
    return api;

}