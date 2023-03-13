const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Role = require('../models').Role;
const Permission = require('../models').Permission;
const Group = require('../models').Group;
const GroupPermission = require('../models').GroupPermission;
const GroupUsers = require('../models').GroupUsers;
const passport = require('passport');
require('../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();

// Create a new Group User
router.post('/', passport.authenticate('jwt', {
    session: false
}), async function (req, res) {
    await helper.checkPermission(req.user.role_id, 'group_user_create').then((rolePerm) => {
        if (!req.body.user_id || !req.body.group_id) {
            res.status(400).send({
                msg: 'Please pass Group ID or User ID.'
            })
        } else {
            const foundUser =  User.findOne({
                where: {
                  user_id: req.body.user_id 
                }
              })
              const foundGroup = Group.findOne({
                where: {
                  group_id: group_id 
                }
              })
              if(!foundUser) {
                res.status(400).send({
                    'message': 'Users not found'
                })
              }
              if(!foundGroup) {
                res.status(400).send({
                    'message': 'Group not found'
                })
              }
             
              GroupUsers
                .create({
                    user_id: foundUser.user_id,
                    group_id: foundGroup.group_id
                })
                .then((groups) => res.status(201).send(groups))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send(error);
                });
        }
    }).catch((error) => {
        res.status(403).send(error);
    });
});

// Get List of Group User
router.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_user_list').then((rolePerm) => {
        GroupUser
            .findAll({
                include: [
                    {
                        model: User,
                        as: 'users',
                    },
                    {
                        model: Group,
                        as: 'groups',
                    }
                ]
            })
            .then((groups) => res.status(200).send(groups))
            .catch((error) => {
                res.status(400).send(error);
            });
    }).catch((error) => {
        res.status(403).send(error);
    });
});

// Get Group User by ID
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_user_read').then((rolePerm) => {

    }).catch((error) => {
        res.status(403).send(error);
    });

    if (!req.params.id) {
        res.status(400).send({
            msg: 'Please pass Group User ID.'
        })
    } else {

        GroupUser
            .findByPk(
                req.params.id, {
                    include: [
                        {
                            model: User,
                            as: 'users',
                        },
                        {
                            model: Group,
                            as: 'groups',
                        }
                    ]
                }
            )
            .then((groups) => res.status(200).send(groups))
            .catch((error) => {
                res.status(400).send(error);
            });
    }
});

// Update a Group User
router.put('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_user_update').then((rolePerm) => {
        if (!req.params.id || !req.body.user_id || !req.body.group_id) {
            res.status(400).send({
                msg: 'Please pass Group User ID, Group ID, User ID.'
            })
        } else {
            GroupUser
                .findByPk(req.params.id)
                .then((group) => {
                    GroupUser.update({
                        user_id: req.body.user_id || group.user_id,
                        group_id: req.body.group_id || group.group_id
                    }, {
                        where: {
                            id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'Group User updated'
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

// Delete a Group User
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_user_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass Group ID.'
            })
        } else {
            GroupUser
                .findByPk(req.params.id)
                .then((group) => {
                    if (group) {
                        GroupUser.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'Group Users deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'Group Users not found'
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