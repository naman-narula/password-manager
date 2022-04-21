import express from 'express';
import UserModel from '../model/user.mjs';
import Crypto from '../Utils/encrypt.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        if (req.session.email) {
            const user = await UserModel.findUser(req.session.email);
            user.apps.forEach((elem) => {
                elem.appPassword = Crypto.decrypt(elem.appPassword);
                elem.fakePassword = '•'.repeat(elem.appPassword.length);
            });
            res.render('secrets', { apps: user.apps });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('secrets',{apps:[]});
    }
});

export default router;
