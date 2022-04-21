import express from 'express';
import UserModel from '../model/user.mjs';
const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        res.render('register', { error: false });
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            const result = await UserModel.saveUser(username, password);
            if (result.success === true) {
                req.session.email = username;
                res.redirect('/login');
            } else {
                res.render('register', { error: true });
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('register', { error: true });
        }
    });

export default router;
