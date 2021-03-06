'use strict';

var express = require('express');
var controller = require('./prono.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', controller.count);
router.get('/:id', controller.show);
router.get('/user_id/:id', controller.showUser);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
