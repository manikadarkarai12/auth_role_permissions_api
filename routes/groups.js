const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Role = require('../models').Role;
const Permission = require('../models').Permission;
const Groups = require('../models').Group;
const GroupPermission = require('../models').GroupPermission;
const passport = require('passport');
const groupusers = require('../models/groupusers').GroupUser;
require('../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();

// Create a new Groups
router.post('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_create').then((rolePerm) => {
        if (!req.body.group_name || !req.body.group_description) {
            res.status(400).send({
                msg: 'Please pass Group name or description.'
            })
        } else {
            Group
                .create({
                    group_name: req.body.group_name,
                    group_description: req.body.group_description
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

// Get List of Groups
router.get('/', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_list').then((rolePerm) => {
        console.log(rolePerm);
        Group
            .findAll({
                include: [
                    {
                        model: GroupUser,
                        as: 'groupusers',
                    },
                    {
                        model: GroupPermission,
                        as: 'grouppermission',
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

// Get Groups by ID
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_read').then((rolePerm) => {

    }).catch((error) => {
        res.status(403).send(error);
    });
    Group
        .findByPk(
            req.params.id, {
                include: [ 
                    {
                        model: GroupUser,
                        as: 'groupusers',
                    },
                    {
                        model: GroupPermission,
                        as: 'grouppermission',
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
    helper.checkPermission(req.user.role_id, 'group_update').then((rolePerm) => {
        if (!req.params.id || !req.body.group_name || !req.body.group_description) {
            res.status(400).send({
                msg: 'Please pass Group ID, name or description.'
            })
        } else {
            Group
                .findByPk(req.params.id)
                .then((group) => {
                    Group.update({
                        group_name: req.body.group_name || group.group_name,
                        group_description: req.body.group_description || group.group_description
                    }, {
                        where: {
                            group_id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'Group updated'
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

// Delete a Groups
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    helper.checkPermission(req.user.role_id, 'group_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass Group ID.'
            })
        } else {
            Group
                .findByPk(req.params.id)
                .then((group) => {
                    if (group) {
                        Group.destroy({
                            where: {
                                group_id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'Group deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'Group not found'
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