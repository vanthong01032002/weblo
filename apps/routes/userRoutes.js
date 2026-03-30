const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.home);
router.get('/login', userController.login);
router.get('/dich-vu', userController.dichVu);
router.get('/khach-hang', userController.khachHang);
router.get('/about', userController.veChungToi);
router.get('/kho-giao-dien', userController.khoGiaoDien);
router.get('/blog', userController.blog);
router.get('/blog/:slug', userController.blogDetail);
router.get('/lien-he',  userController.lienHe);
router.post('/lien-he', userController.lienHeSend);

module.exports = router;