const userService = require('../services/userService');
const SlideshowModel = require('../models/slideshowModel');
const PricingModel   = require('../models/pricingModel');
const ServicesModel  = require('../models/servicesModel');
const SocialModel    = require('../models/socialModel');
const SocialFooterModel = require('../models/socialFooterModel');
const SettingsModel     = require('../models/settingsModel');
const BlogModel         = require('../models/blogModel');
const SeoModel          = require('../models/seoModel');
const ProcessModel      = require('../models/processModel');

// Helper: load social buttons cho mọi trang
async function getSocialButtons() {
    try { return await SocialModel.getAllActive(); } catch { return []; }
}
async function getSocialFooter() {
    try { return await SocialFooterModel.getAllActive(); } catch { return []; }
}
async function getSettings() {
    try { return await SettingsModel.getAll(); } catch { return {}; }
}

// render login
exports.login = (req, res) => {
    res.render('user/login');
};

// trang chủ
exports.home = async (req, res) => {
    try {
        const [users, slides, pricing, socialButtons, socialFooter, settings, featuredPosts, seo, processSteps] = await Promise.all([
            userService.getAllUsers(),
            SlideshowModel.getAllActive(),
            PricingModel.getAllActive(),
            getSocialButtons(),
            getSocialFooter(),
            getSettings(),
            BlogModel.getFeatured(6),
            SeoModel.getByKey('home'),
            ProcessModel.getAllActive()
        ]);
        res.render('user/index', { layout: 'layouts/main', title: seo.title || 'Trang chủ', users, slides, pricing, socialButtons, socialFooter, settings, featuredPosts, seo, processSteps });
    } catch (error) {
        console.error(error);
        res.send("Lỗi database");
    }
};

// trang dịch vụ
exports.dichVu = async (req, res) => {
    try {
        const [services, socialButtons, socialFooter, settings, seo] = await Promise.all([ServicesModel.getAllActive(), getSocialButtons(), getSocialFooter(), getSettings(), SeoModel.getByKey('services')]);
        res.render('user/dich-vu', { layout: 'layouts/main', title: seo.title || 'Dịch vụ - Webtop', services, socialButtons, socialFooter, settings, seo });
    } catch (error) {
        console.error(error);
        res.render('user/dich-vu', { layout: 'layouts/main', title: 'Dịch vụ - Webtop', services: [], socialButtons: [], socialFooter: [], settings: {}, seo: {} });
    }
};

// trang khách hàng
exports.khachHang = async (req, res) => {
    const [socialButtons, socialFooter, settings] = await Promise.all([getSocialButtons(), getSocialFooter(), getSettings()]);
    res.render('user/khach-hang', { layout: 'layouts/main', title: 'Khách hàng - Webtop', socialButtons, socialFooter, settings });
};

// trang về chúng tôi
exports.veChungToi = async (req, res) => {
    const [socialButtons, socialFooter, settings] = await Promise.all([getSocialButtons(), getSocialFooter(), getSettings()]);
    res.render('user/ve-chung-toi', { layout: 'layouts/main', title: 'Về chúng tôi - Webtop', socialButtons, socialFooter, settings });
};

// kho giao diện
exports.khoGiaoDien = async (req, res) => {
    const [socialButtons, socialFooter, settings] = await Promise.all([getSocialButtons(), getSocialFooter(), getSettings()]);
    res.render('user/kho-giao-dien', { layout: 'layouts/main', title: 'Kho giao diện website - Webtop', socialButtons, socialFooter, settings });
};

// blog

exports.blog = async (req, res) => {
    const [posts, socialButtons, socialFooter, settings, seo] = await Promise.all([
        BlogModel.getAllActive(), getSocialButtons(), getSocialFooter(), getSettings(), SeoModel.getByKey('news')
    ]);
    res.render('user/blog', { layout: 'layouts/main', title: seo.title || 'Blog - Webtop', posts, socialButtons, socialFooter, settings, seo });
};

exports.blogDetail = async (req, res) => {
    try {
        const [post, socialButtons, socialFooter, settings] = await Promise.all([
            BlogModel.getBySlug(req.params.slug), getSocialButtons(), getSocialFooter(), getSettings()
        ]);
        if (!post) return res.status(404).render('user/blog', { layout: 'layouts/main', title: 'Không tìm thấy', posts: [], socialButtons, socialFooter, settings });
        await BlogModel.incrementViews(post.id);
        res.render('user/blog-detail', {
            layout: 'layouts/main',
            title: post.seo_title || post.title,
            post, socialButtons, socialFooter, settings
        });
    } catch (err) {
        console.error(err);
        res.redirect('/blog');
    }
};

// liên hệ
const ContactModel = require('../models/contactModel');

exports.lienHe = async (req, res) => {
    const [contactPage, socialButtons, socialFooter, settings] = await Promise.all([
        ContactModel.getPage(), getSocialButtons(), getSocialFooter(), getSettings()
    ]);
    res.render('user/lien-he', { layout: 'layouts/main', title: 'Liên hệ - Webtop', contactPage, socialButtons, socialFooter, settings, sent: false });
};

exports.lienHeSend = async (req, res) => {
    try {
        const { full_name, email, phone, subject, message } = req.body;
        await ContactModel.saveMessage({ full_name, email, phone, subject, message });
        const [contactPage, socialButtons, socialFooter, settings] = await Promise.all([
            ContactModel.getPage(), getSocialButtons(), getSocialFooter(), getSettings()
        ]);
        res.render('user/lien-he', { layout: 'layouts/main', title: 'Liên hệ - Webtop', contactPage, socialButtons, socialFooter, settings, sent: true });
    } catch (err) {
        console.error(err);
        res.redirect('/lien-he');
    }
};
