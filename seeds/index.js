const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/campfinder", {});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "63e179a6e02f6abffb1c863b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/doh0oy2mj/image/upload/v1675871052/CampFinder/osdujnkip28nnkd5shdb.jpg",
          filename: "CampFinder/osdujnkip28nnkd5shdb",
        },
        {
          url: "https://res.cloudinary.com/doh0oy2mj/image/upload/v1675871051/CampFinder/v1p6ol2lux4kqevw4ham.jpg",
          filename: "CampFinder/v1p6ol2lux4kqevw4ham",
        },
      ],
    });
    //   // image: "https://source.unsplash.com/random/300x300?camping,${i}",
    //   image: "https://source.unsplash.com/collection/483251",
    //   description:
    //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
    //   price,
    // });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
