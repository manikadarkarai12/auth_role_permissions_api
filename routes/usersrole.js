const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Role = require('../models').Role;
const Permission = require('../models').Permission;
const Groups = require('../models').Group;
const RolePermission = require('../models').RolePermission;
const GroupPermission = require('../models').GroupPermission;
const UsersRole = require('../models').UsersRole;
const GroupUser = require('../models/groupusers').GroupUser;

const passport = require('passport');
require('../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();

// Create a new Users Role
router.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'user_role_create').then((rolePerm) => {
        if (!req.body.role_id || !req.body.perm_id) {
            res.status(400).send({
                msg: 'Please pass User ID or Role ID.'
            })
        } else {
            const foundUser =  User.findOne({
                where: {
                    user_id: req.body.user_id 
                }
              })
              const foundRole = Role.findOne({
                where: {
                    role_id: role_id 
                }
              })
              if(!foundRole) {
                res.status(400).send({
                    'message': 'Role not found'
                })
              }
              if(!foundUser) {
                res.status(400).send({
                    'message': 'User not found'
                })
              }

              UsersRole
                .create({
                    user_id: foundUser.user_id,
                    role_id: foundRole.role_id
                })
                .then((permrole) => res.status(201).send(permrole))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send(error);
                });
        }
    }).catch((error) => {
        res.status(403).send(error);
    });
});

// Get List of Users Role
router.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'user_role_list').then((rolePerm) => {
        console.log(rolePerm);
        UsersRole
            .findAll({
                include: [
                    {
                        model: Role,
                        as: 'roles',
                    },
                    {
                        model: RolePermission,
                        as: 'rolepermission',
                    }                   
                ]
            })
            .then((permrole) => res.status(200).send(permrole))
            .catch((error) => {
                res.status(400).send(error);
            });
    }).catch((error) => {
        res.status(403).send(error);
    });
});

// Get User Role by ID
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'user_role_read').then((rolePerm) => {

    }).catch((error) => {
        res.status(403).send(error);
    });
    UsersRole
        .findByPk(
            req.params.id, {
                include: [ 
                    {
                        model: Role,
                        as: 'roles',
                    },
                    {
                        model: RolePermission,
                        as: 'permission',
                    }  
                ]   
            }
        )
        .then((permrole) => res.status(200).send(permrole))
        .catch((error) => {
            res.status(400).send(error);
        });
});

// Update a User Role
router.put('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'user_role_update').then((rolePerm) => {
        if (!req.params.id || !req.body.perm_id || !req.body.role_id) {
            res.status(400).send({
                msg: 'Please pass User ID, Role ID.'
            })
        } else {
            const foundUser =  User.findOne({
                where: {
                    user_id: req.body.user_id 
                }
              })
              const foundRole = Role.findOne({
                where: {
                    role_id: role_id 
                }
              })
              if(!foundRole) {
                res.status(400).send({
                    'message': 'Role not found'
                })
              }
              if(!foundUser) {
                res.status(400).send({
                    'message': 'User not found'
                })
              }

              UsersRole
                .findByPk(req.params.id)
                .then((permrole) => {
                    UsersRole.update({
                        user_id: foundUser.user_id,
                        role_id: foundRole.role_id
                    }, {
                        where: {
                            id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'User Role updated'
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

// Delete a Users Role
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'user_role_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass Group Permission ID.'
            })
        } else {
            UsersRole
                .findByPk(req.params.id)
                .then((permrole) => {
                    if (permrole) {
                        UsersRole.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'User role deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'User role not found'
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


module.exports = router;