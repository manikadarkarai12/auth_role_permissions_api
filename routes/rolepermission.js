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

// Create a new Role Permission
router.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'role_permission_create').then((rolePerm) => {
        if (!req.body.role_id || !req.body.perm_id) {
            res.status(400).send({
                msg: 'Please pass Group ID or Role ID.'
            })
        } else {
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
                Role
                    .findByPk(req.params.id)
                    .then((role) => {
                        RolePermission.destroy({
                            where: {
                                role_id: role.id
                            }
                        }).then(_ => {
                            JSON.parse(req.body.permissions).forEach(function (item, index) {
                                Permission
                                    .findByPk(item)
                                    .then(async (perm) => {
                                        await role.addPermissions(perm, {
                                            through: {
                                                selfGranted: false
                                            }
                                        });
                                    })
                                    .catch((error) => {
                                        res.status(400).send({
                                            success: false,
                                            msg: error
                                        });
                                    });
                            });
                            res.status(200).send({
                                'message': 'Permissions added'
                            });
                        }).catch(err => res.status(400).send({
                            success: false,
                            msg: err
                        }));
                    })
                    .catch((error) => {
                        res.status(400).send({
                            success: false,
                            msg: error
                        });
                    });
        }
    }).catch((error) => {
        res.status(403).send(error);
    });
});

// Get List of Role Permission
router.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'role_permission_list').then((rolePerm) => {
        console.log(rolePerm);
        RolePermission
            .findAll({
                include: [
                    {
                        model: Role,
                        as: 'roles',
                    },
                    {
                        model: Permission,
                        as: 'permission',
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

// Get Role Permission by ID
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'role_permission_read').then((rolePerm) => {

    }).catch((error) => {
        res.status(403).send(error);
    });
    RolePermission
        .findByPk(
            req.params.id, {
                include: [ 
                    {
                        model: Role,
                        as: 'roles',
                    },
                    {
                        model: Permission,
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

// Update a Role Permission
router.put('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'role_permission_update').then((rolePerm) => {
        if (!req.params.id || !req.body.perm_id || !req.body.role_id) {
            res.status(400).send({
                msg: 'Please pass Group ID, Role ID.'
            })
        } else {
            const foundPermission =  Permission.findOne({
                where: {
                    perm_id: req.body.perm_id 
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
              if(!foundPermission) {
                res.status(400).send({
                    'message': 'Permission not found'
                })
              }

            RolePermission
                .findByPk(req.params.id)
                .then((permrole) => {
                    RolePermission.update({
                        perm_id: foundPermission.perm_id,
                        role_id: foundRole.role_id
                    }, {
                        where: {
                            id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'Role Permission updated'
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

// Delete a Role Permission
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'role_permission_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass Group Permission ID.'
            })
        } else {
            RolePermission
                .findByPk(req.params.id)
                .then((permrole) => {
                    if (permrole) {
                        RolePermission.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'Role Permission deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'Role Permission not found'
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