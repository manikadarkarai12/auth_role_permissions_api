const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const UsersRole = require('../models/usersrole');
const RolePermission = require('../models/rolepermission');
const json2csvParser = require('json2csv').Parser;
const fs = require("fs");
const md5 = require('md5');
const passport = require('passport');
require('../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();

// Create a new User
router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  helper.checkPermission(req.user.role_id, 'user_create').then((rolePerm) => {
    if (!req.body.email || !req.body.password || !req.body.fullname || !req.body.phone) {
      res.status(400).send({
        msg: 'Please pass email, password, phone or fullname.'
      })
    } else {
      User
        .create({
          email: req.body.email,
          password: req.body.password,
          fullname: req.body.fullname,
          phone: req.body.phone
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => {
          console.log(error);
          res.status(400).send(error);
        });
    }
  }).catch((error) => {
    res.status(403).send(error);
  });
});

// Get List of Users
router.get('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) { console.log("im here");
  helper.checkPermission(req.user.role_id, 'user_get_all').then((rolePerm) => {
    User
      .findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => {
        res.status(400).send(error);
      });
  }).catch((error) => {
    res.status(403).send(error);
  });
});

// Get User by ID
router.get('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  helper.checkPermission(req.user.role_id, 'user_read').then((rolePerm) => {
    User
      .findByPk(req.params.id)
      .then((user) => res.status(200).send(user))
      .catch((error) => {
        res.status(400).send(error);
      });
  }).catch((error) => {
    res.status(403).send(error);
  });
});

// Update a User
router.put('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  helper.checkPermission(req.user.role_id, 'user_update').then((rolePerm) => {
    if (!req.body.email || !req.body.password || !req.body.fullname || !req.body.phone) {
      res.status(400).send({
        msg: 'Please pass email, password, phone or fullname.'
      })
    } else {
      User
        .findByPk(req.params.id)
        .then((user) => {
          User.update({
            email: req.body.email || user.email,
            password: req.body.password || user.password,
            fullname: req.body.fullname || user.fullname,
            phone: req.body.phone || user.phone
          }, {
            where: {
              user_id: req.params.id
            }
          }).then(_ => {
            res.status(200).send({
              'message': 'User updated'
            });
          }).catch(err => res.status(400).send(err));
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  }).catch((error) => {
    res.status(403).send(error);
  });
});

// Delete a User
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  helper.checkPermission(req.user.role_id, 'user_delete').then((rolePerm) => {
    if (!req.params.id) {
      res.status(400).send({
        msg: 'Please pass user ID.'
      })
    } else {
      User
        .findByPk(req.params.id)
        .then((user) => {
          if (user) {
            User.destroy({
              where: {
                user_id: req.params.id
              }
            }).then(_ => {
              res.status(200).send({
                'message': 'User deleted'
              });
            }).catch(err => res.status(400).send(err));
          } else {
            res.status(404).send({
              'message': 'User not found'
            });
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  }).catch((error) => {
    res.status(403).send(error);
  });
});

// Export Users details with Permissions
router.get('/export', passport.authenticate('jwt', {
  session: false
}), function (req, res) { 
  helper.checkPermission(req.user.role_id, 'user_export_permission').then((rolePerm) => {
    User
      .findAll({
        include: [{
            model: UsersRole,
            include: [{
              model: RolePermission
            }]
        }]
      })
      .then((usersjson) => { 
        let json2csvParsers = new json2csvParser({ header : true });
        let csv = json2csvParser.parse(usersjson);
        let fileName = new Date().getTime();
        fs.writeFile('../uploads/'+fileName+'.csv', csv, function(err) {
              if (err) throw err;
               console.log('file saved');
               res.status(200).send(fileName);
        });            
       
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }).catch((error) => {
    res.status(403).send(error);
  });
});

// Export Users details with Permissions
router.get('/download/:filename', passport.authenticate('jwt', {
  session: false
}), function (req, res) { 
  helper.checkPermission(req.user.role_id, 'user_export_permission').then((rolePerm) => {
    if (!req.params.filename) {
      res.status(400).send({
        msg: 'Please pass file name!.'
      })
    } else {
      let endTime = new Date().getTime();
      let startTime = req.params.filename;
      let resolution = endTime - startTime;
      var resolutionTime = (((resolution / 1000) / 60));
      if(resolutionTime > 5) { res.status(404).send({'message': 'URL expired'}); 
      }else{
        let fileSourceName = "../uploads/"+startTime+".csv";
        res.setHeader('Content-disposition', 'attachment; filename='+fileSourceName);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
      }
    }
  }).catch((error) => { 
    res.status(403).send(error);
  });
});

module.exports = router;