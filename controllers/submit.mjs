import express from 'express';
import UserModel from '../model/user.mjs';
const router = express.Router();

router
    .route('')
    .get((req, res) => {
        if (req.session.email) {
            res.render('submit');
        }
    })
    .post(async (req, res) => {
        const { appName, appPassword } = req.body;
        console.log(appName, appPassword);
        await UserModel.addApp(appName, appPassword, req.session.email);
        res.redirect('/passwords');
    });

export default router;
