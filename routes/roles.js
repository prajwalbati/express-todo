let router = require('express').Router();

let { isLoggedIn } = require("../middleware/authenticateMiddleware");
let roleController = require("../controllers/roleController");

router.get('/', [isLoggedIn], roleController.index);

router.get('/add', [isLoggedIn], roleController.add);

router.post('/add', [isLoggedIn], roleController.addRole);

router.get('/:id/edit', [isLoggedIn], roleController.edit);

router.post('/:id/edit', [isLoggedIn], roleController.editRole);

router.delete('/:id/delete', [isLoggedIn], roleController.deleteRole);

module.exports = router;
