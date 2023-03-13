const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const User = require('../models').User;
const Role = require('../models').Role;
const UsersRole = require('../models').user_roles;

router.post('/signup', async function (req, res) { 
    if (!req.body.email || !req.body.password || !req.body.fullname) {
        res.status(400).send({
            msg: 'Please pass username, password and name.'
        })
    } else {
      await  Role.findOne({
            where: {
                role_name: 'admin'
            }
        }).then( async (role) => { 
            await User.create({
                email: req.body.email,
                password: req.body.password,
                fullname: req.body.fullname,
                phone: req.body.phone
            },
            // {
            //     include: [{
            //         model: UsersRole,
            //         as: "User_UsersRole"
            //       }]
            // }
            )
            .then(async (user) =>{  
                await user.addRoles([role.id])
                // await user_roles
                // .create({
                //     user_id: user.id,
                //     role_id:  role.id
                // })
                res.status(201).send(user);
                
             }).then((permrole) => res.status(201).send(user))
             .catch((error) => {
                    console.log(error);
                    res.status(400).send(error);
                });      

        }).catch((error) => { console.log("Imhere");console.log(error);
            res.status(400).send(error);
        });
    }
});

router.post('/signin', async function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            msg: 'Please pass username, password'
        })
    } else { 
       await User
            .findOne({
                distrinct:true,
                include: {
                        model: UsersRole, 
                        as : "User_UsersRole",  
                        through: {                           
                            attributes: []
                          },
                        attributes: ['user_id', 'role_id'], exclude: ['UsersRoleId']  ,
                        required: true                     

                    },
                    where: {
                        email: req.body.email
                    }
            })
            .then(async (user) => {
                if (!user) {
                    return res.status(401).send({
                        message: 'Authentication failed. User not found.',
                    });
                }
              await  user.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {
                            expiresIn: 86400 * 30
                        });
                        jwt.verify(token, 'nodeauthsecret', function (err, data) {
                            console.log(err, data);
                        })
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    } else {
                        res.status(401).send({
                            success: false,
                            msg: 'Authentication failed. Wrong password.'
                        });
                    }
                })
            })
            .catch((error) => {  console.log(error); res.status(400).send(error);});
        }
});

module.exports = router;