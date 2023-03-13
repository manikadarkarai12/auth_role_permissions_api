const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Role = require('../models').Role;
const Permission = require('../models').Permission;
const Groups = require('../models').Group;
const RolePermission = require('../models').RolePermission;
const GroupPermission = require('../models').GroupPermission;
const passport = require('passport');
const groupusers = require('../models/groupusers').GroupUser;
require('../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();

// Create a new Group Permission
router.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_permission_create').then((rolePerm) => {
        if (!req.body.group_id || !req.body.role_id) {
            res.status(400).send({
                msg: 'Please pass Group ID or Role ID.'
            })
        } else {
            const foundRole =  Role.findOne({
                where: {
                  role_id: req.body.role_id 
                }
              })
              const foundGroup = Group.findOne({
                where: {
                  group_id: group_id 
                }
              })
              if(!foundRole) {
                res.status(400).send({
                    'message': 'Role not found'
                })
              }
              if(!foundGroup) {
                res.status(400).send({
                    'message': 'Group not found'
                })
              }

            GroupPermission
                .create({
                    group_id: foundGroup.group_id,
                    role_id: foundRole.role_id
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

// Get List of GroupPermission
router.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_permission_list').then((rolePerm) => {
        console.log(rolePerm);
        GroupPermission
            .findAll({
                include: [
                    {
                        model: Group,
                        as: 'groups',
                    },
                    {
                        model: Role,
                        as: 'role',
                    },
                    {
                        model: RolePermission,
                        as: 'rolepermission',
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

// Get GroupPermission by ID
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_permission_read').then((rolePerm) => {

    }).catch((error) => {
        res.status(403).send(error);
    });
    GroupPermission
        .findByPk(
            req.params.id, {
                include: [ 
                    {
                        model: Group,
                        as: 'groups',
                    },
                    {
                        model: Role,
                        as: 'role',
                    },
                    {
                        model: RolePermission,
                        as: 'rolepermission',
                    }
                ]   
            }
        )
        .then((groups) => res.status(200).send(groups))
        .catch((error) => {
            res.status(400).send(error);
        });
});

// Update a Groups
router.put('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_permission_update').then((rolePerm) => {
        if (!req.params.id || !req.body.group_id || !req.body.role_id) {
            res.status(400).send({
                msg: 'Please pass Group ID, Role ID.'
            })
        } else {
            const foundRole =  Role.findOne({
                where: {
                  role_id: req.body.role_id 
                }
              })
              const foundGroup = Group.findOne({
                where: {
                  group_id: group_id 
                }
              })
              if(!foundRole) {
                res.status(400).send({
                    'message': 'Role not found'
                })
              }
              if(!foundGroup) {
                res.status(400).send({
                    'message': 'Group not found'
                })
              }

            GroupPermission
                .findByPk(req.params.id)
                .then((group) => {
                    GroupPermission.update({
                        group_id: foundGroup.group_id || group.group_id,
                        role_id: foundRole.role_id || group.role_id
                    }, {
                        where: {
                            group_id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'Group Permission updated'
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

// Delete a Groups Permission
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_permission_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass Group Permission ID.'
            })
        } else {
            GroupPermission
                .findByPk(req.params.id)
                .then((group) => {
                    if (group) {
                        GroupPermission.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'Group Permission deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'Group Permission not found'
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