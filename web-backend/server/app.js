import Express from 'express';
import BodyParser from 'body-parser';
import Session from 'express-session';
import Cors from 'cors';
import Passport from 'passport';
import CookieParser from 'cookie-parser';
import Path from "path";

import { SERVER_SETTINGS } from "./config/constants/app.constants";

import ViewRoutes from './routes/view.routes';
import ApiRoutes from './routes/api.routes';

const App = Express();
const MemoryStore  = require('memorystore')(Session);

let session_setting = {
    secret: SERVER_SETTINGS.session_secret,
    resave: true,
    saveUninitialized: true,
    name: SERVER_SETTINGS.session_name,
    store: new MemoryStore({
        checkPeriod: 86400000 
    }),
    cookie: {
        secure: false,
        httpOnly: false,
        domain: SERVER_SETTINGS.server,
        maxAge: 36000000,
        expires: new Date(Date.now() + 1860 * 60 * 1000 * 24)
    }
}

App.use(Cors());
App.use(BodyParser.json({limit: '50mb'}));
App.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
App.use(CookieParser(SERVER_SETTINGS.session_secret));
App.use(Session(session_setting));
App.use(Passport.initialize());
App.use(Passport.session());
App.set('views', Path.join(__dirname, "..", "views"));
App.set("view engine", "ejs");
App.use('/assets', Express.static(Path.join(__dirname, "../assets")));

App.use("/", ViewRoutes);

ApiRoutes(App);

App.use((req, res, next) => {
    next();
});


App.listen(SERVER_SETTINGS.port, () => { console.log(`Running localhost at port ${SERVER_SETTINGS.port}`); });