// // If we are in development mode we will require .env file
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const ejsMate = require("ejs-mate");
// const session = require("express-session");
// const flash = require("connect-flash");
// const ExpressError = require("./utils/ExpressError");
// const methodOverride = require("method-override");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const userRoutes = require("./routes/users");
// const campgroundRoutes = require("./routes/campgrounds");
// const reviewRoutes = require("./routes/reviews");

// const MongoStore = require("connect-mongo");

// const dbUrl = "mongodb://localhost:27017/campfinder";
// // const dbUrl = process.env.DB_URL;

// mongoose.set("strictQuery", false);
// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

// const app = express();

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//   })
// );

// const secret = process.env.SECRET || "thisshouldbeabettersecret!";

// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   secret: secret,
//   touchAfter: 24 * 60 * 60,
//   // crypto: {secret: "squirrel",},
// });

// store.on("error", function (e) {
//   console.log("SESSION STORE ERROR", e);
// });

// const sessionConfig = {
//   store,
//   name: "session",
//   // secret: "thisshouldbeabettersecret!",
//   secret: secret,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     // secure: true,
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   },
// };
// app.use(session(sessionConfig));
// app.use(flash());
// app.use(helmet());

// const scriptSrcUrls = [
//   "https://api.tiles.mapbox.com/",
//   "https://api.mapbox.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://cdn.jsdelivr.net/",
// ];
// const connectSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://a.tiles.mapbox.com/",
//   "https://b.tiles.mapbox.com/",
//   "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       connectSrc: ["'self'", ...connectSrcUrls],
//       scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//       styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//       workerSrc: ["'self'", "blob:"],
//       objectSrc: [],
//       imgSrc: [
//         "'self'",
//         "blob:",
//         "data:",
//         "https://res.cloudinary.com/",
//         "https://images.unsplash.com/",
//         "https://source.unsplash.com/",
//       ],
//       fontSrc: ["'self'", ...fontSrcUrls],
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   res.locals.currentUser = req.user;
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

// app.use("/", userRoutes);
// app.use("/campgrounds", campgroundRoutes);
// app.use("/campgrounds/:id/reviews", reviewRoutes);

// app.get("/", (req, res) => {
//   res.render("home");
// });

// // catch all for requests that do not match any routes
// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });

// // error handling
// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Oh No, Something Went Wrong!";
//   res.status(statusCode).render("error", { err });
// });

// app.listen(3000, () => {
//   console.log("Serving on port http://localhost:3000");
// });

// If we are in development mode we will require .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// All requires
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
// const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/campfinder";
const dbUrl = "mongodb://localhost:27017/campfinder";

// Express
const app = express();
const port = process.env.PORT || 3000;

// Fix deprecated mongoose
mongoose.set("strictQuery", false);

// Configure express and ejs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

// Session configuration & flash
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: "thisWillBeABetterSecret",
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret: "thisWillBeABetterSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Only works on https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(helmet());
const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/",
        "https://images.unsplash.com/",
        "https://source.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Make sure passport is used after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware before route handlers
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes from router
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// If all routes don't match throw a 404
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Error middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode);
  res.render("error", { err });
});

// Connect to MongoDB
main().catch((err) => console.log(err));
async function main() {
  mongoose.connect(dbUrl);
  console.log("Connection open!");
  // Starting up app on desired port
  app.listen(port, () => {
    console.log(`Serving on http://localhost:${port}`);
  });
}
