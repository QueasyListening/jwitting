const User = require('../users/Users.js');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local');


function makeToken(user) {
    //return token
    // sub: subject (id)
    const timeStamp = new Date().getTime();
    const payload = {
        sub: user._id,
        username: user.username,
        iat: timeStamp,
    };
    const secret = 'nosizelimitontokens';
    const options = { expiresIn: '4h' }
    return jwt.sign(payload, secret, options);
}

const localStrategy = new LocalStrategy(function(username, password, done) {
    User.findOne({ username }, function(err, user) {
        if (err) { done(err) }

        if(!user) {
            done(null, false);
        }
        console.log(user);
        user.verifyPassword(password, function(isValid) {
            if (isValid) {
                const { _id, username } = user;
                return done(null, { _id, username });
            }

            return done(null, false);
        });
    });
});

//user strategies
passport.use(localStrategy);

//generate passport middleware
const authenticate = passport.authenticate('local', { session: false })

module.exports = function(server) {
    
    server.get('/', (req, res) => {
        res.send({api: 'up and running'});
    });

    server.post('/register', (req, res) => {
        const credentials = req.body;
        const user = new User(credentials);
        console.log(user);
        user.save().then(inserted => {
            const token = makeToken(inserted);
            console.log(inserted);
            res.send({ token, inserted });
            }).catch(err => res.status(500).send(err));
   });

   server.post('/login', authenticate, (req, res) => {
       res.json({ token: makeToken(req.user), user: req.user});
   });
}
//https://zoom.us/j/915942356