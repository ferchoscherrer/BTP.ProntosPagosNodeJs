import * as xsenv from '@sap/xsenv'; 
xsenv.loadEnv()

import {JWTStrategy} from '@sap/xssec'; 
import { Express } from 'express';
import passport from 'passport'

const xsuaaCredentials = xsenv.getServices({'uaa':{'tag': "xsuaa"}}).uaa
passport.use(new JWTStrategy(xsuaaCredentials))

export function initializePassport(app: Express) {
    app.use(passport.initialize())
}

export function authPassport(app: Express) {
    app.use(passport.authenticate('JWT', { session: false }))
}