const express = require("express");
const { pool } = require("./dbConfig");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const ejs = require("ejs");
require("dotenv").config();

const app = express();

const cookieParser = require("cookie-parser");

const initializePassport = require("./passportConfig")

initializePassport(passport);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: false
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(cookieParser());


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/events", function (req, res) {
    res.render("events");
});

app.get("/signup", checkAuthenticated, (req, res) => {
    res.render("signup");
});

app.get("/login", checkAuthenticated, (req, res) => {
    res.render("login");
});

app.get('/logout', checkNotAuthenticated, function (req, res, next) {
    req.logOut(function(err) {
        if (err) {
            return next(err);
        }
        res.status(200).clearCookie('connect.sid', {
            path: '/'
        });
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });
});

app.post("/signup", async (req, res) => {
    let { name, email, username, password, password2, pincode, city, insti, yos, gender, phno, wapp, insta, fb } = req.body;

    console.log({
        name,
        email,
        username,
        password,
        pincode,
        city,
        insti,
        yos,
        gender,
        phno,
        wapp,
        insta,
        fb
    });

    let errors = [];

    if (!name || !email || !username || !password || !password2 || !pincode || !city || !insti || !yos || !gender || !phno || !wapp) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should atleast be greater than 6 characters" });
    }

    if (password != password2) {
        errors.push({ message: "Passwords do not match" })
    }

    if (errors.length > 0) {
        res.render("signup", { errors });
    } else {

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(results.rows.length);

                if (results.rows.length > 0) {
                    errors.push({ message: "Email already registered" })
                    res.render("signup", { errors });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, username, password, pincode, city, insti, yos, gender, phno, wapp, insta, fb)
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                        RETURNING id, username, password`,
                        [name, email, username, hashedPassword, pincode, city, insti, yos, gender, phno, wapp, insta, fb],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }

                            console.log(results.rows);
                            res.redirect("/login");
                        }
                    )
                }
            }
        );
    }
})

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), async (req,res) => {

    let {username} = req.body
    res.cookie('current-user', req.body.username);
    res.redirect("/events")
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.get("/tevents", checkNotAuthenticated, function (req, res) {
    const cookies = req.cookies;
    const currentUser = cookies['current-user'];

    if (currentUser) {
        res.render("tevents", {
            user: currentUser
        });
    } else {
        res.render("tevents");
    }
})

app.post("/tevents", function (req, res) {
    const cookies = req.cookies;
    const currentUser = cookies['current-user'];

    let { username, tname, tleader, tmember, teamevent } = req.body;

    console.log({
        username,
        tname,
        tleader,
        tmember,
        teamevent
    });

    let errors = [];

    console.log(currentUser);

    if (currentUser != username) {
        errors.push({ message: "Wrong Username" })
        res.render("tevents", { errors });
    } else {
        pool.query(
            `SELECT * FROM tevents WHERE username=$1 and teamevent=$2`,
            [username, teamevent],
            (err, results) => {
                if (err) {
                    throw err;
                }

                console.log(results.rows);

                if (results.rows.length > 0) {
                    errors.push({ message: "Already registered" })
                    res.render("tevents", { errors });
                } else {
                    pool.query(
                        `INSERT INTO tevents (username, tname, tleader, tmember, teamevent)
                        VALUES ($1,$2,$3,$4,$5)
                        RETURNING username, teamevent`,
                        [username, tname, tleader, tmember, teamevent],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            res.redirect("/events")
                        }
                    )
                }
            }
        )
    }
})

app.get("/ievents", function (req, res) {
    const cookies = req.cookies;
    const currentUser = cookies['current-user'];

    if (currentUser) {
        res.render("ievents", {
            user: currentUser
        });
    } else {
        res.render("ievents");
    }
})

app.post("/ievents", function (req, res) {

    const cookies = req.cookies;
    const currentUser = cookies['current-user'];

    let { username, indevent } = req.body;

    console.log({
        username,
        indevent
    });

    let errors = [];

    if (currentUser != username) {
        errors.push({ message: "Wrong Username" })
        res.render("ievents", { errors });
    } else {
        pool.query(
            `SELECT * FROM ievents WHERE username=$1 and indevent=$2`,
            [username, indevent],
            (err, results) => {
                if (err) {
                    throw err;
                }

                console.log(results.rows);

                if (results.rows.length > 0) {
                    errors.push({ message: "Already registered" })
                    res.render("ievents", { errors });
                } else {
                    pool.query(
                        `INSERT INTO ievents (username, indevent)
                        VALUES ($1,$2)
                        RETURNING username, indevent`,
                        [username, indevent],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            res.redirect("/events");
                        }
                    )
                }
            }
        )
    }
})

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "views/home.ejs"));
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started successfully!");
});