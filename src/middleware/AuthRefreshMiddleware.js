const jwt = require('jsonwebtoken')
const db = require("../db/db");
const crypt = require("../crypt/crypt");
const decodeJWT = require('jwt-decode');
const accessTokenSecretAccess = process.env.CIBER_PRM_JWT_ACCESS;
const accessTokenSecretRefresh = process.env.CIBER_PRM_JWT_REFRESH;
var accessToken = undefined;
var decodeTk = undefined;
var refreshToken = undefined;
const verifyToken = async (req, res, next) => {
    try {
        accessToken = crypt.decrypt(req.body.accessToken);
        decodeTk = decodeJWT(accessToken);
        // if (req.originalUrl !== '/auThRefresh') {


        //     const checkRole = await db.query(`select t2."RoleType",t2."View",t2."Create/Edit/Delete",t2."Approve",t2."All" from prm."userRole" t1 inner join
        // prm."roles" t2 on t1."RoleID" = t2."RoleID" where t1."userId"='${decodeTk.userId}'`);

        // }
        db.query(`select "refreshToken",activate from prm."users" where "userId"='${decodeTk.userId}'`, (err, resp) => {
            if (err) {
                return res.status(500).json({ message: err });
            } else {
                if (resp.rows.length > 0) {
                    if (resp.rows[0].refreshToken === '' || resp.rows[0].activate === false) {
                        return res.status(403).json({ database: err });
                    } else {
                        jwt.verify(accessToken, accessTokenSecretAccess, (error, decoded) => {
                            if (!error || error.message === 'jwt expired') {
                                try {
                                    refreshToken = crypt.decrypt(resp.rows[0].refreshToken);
                                    jwt.verify(refreshToken, accessTokenSecretRefresh, (error, decoded) => {
                                        if (error) {
                                            return res.status(403).json({ message: 'refreshToken is old' });
                                        } else {
                                            const DbAccessTK = jwt.sign(
                                                {
                                                    "userId": decodeTk.userId,
                                                    key: process.env.CIBER_PRM_KEY_PRIVATE,
                                                },
                                                accessTokenSecretAccess,
                                                {
                                                    expiresIn: '30s'
                                                }
                                            )
                                            const accessToken = crypt.encrypt(DbAccessTK);
                                            // const vRole = resp.rows;
                                            // for (const property in resp.rows) {
                                            //     delete vRole[property].refreshToken;
                                            //   }
                                            return res.status(200).json({ accessToken: accessToken });
                                        }
                                    });
                                } catch (error) {
                                    return res.status(403).json({ message: 'error' });
                                }
                            } else {
                                return res.status(403).json({ message: 'error' });
                            }
                        });
                    }
                } else {
                    return res.status(403).json({ message: 'error' });
                }
            }
        })
    } catch (error) {
        return res.status(401).json({ database: error });
    }
}

module.exports = verifyToken
