import { saveContact, addTwoNumberFn } from '../controllers/controller.js';
import express from 'express';

const router = express.Router();

router.post('/contact', saveContact);

router.get('/addTwoNumber', addTwoNumberFn);

export default (app) => {
    app.use(router);
};
