import express from 'express';
import UserModel from '../model/user.mjs';
const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        if (req.session.email) {
            res.redirect('/passwords');
        } else res.render('login',{error:false});
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            const result = await UserModel.authenticateUser(username, password);
            if (result.authenticated) {
                req.session.email = username;
                res.redirect('/passwords');
            } else {
                res.status(400).render('login',{error:true});
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('login',{error:true});
        }
    });

export default router;
