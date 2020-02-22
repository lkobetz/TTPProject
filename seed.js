const db = require("./server/db/db");
const { green, red } = require("chalk");
const User = require("./server/db/user");

const users = [
  {
    name: "Steve",
    email: "steve@email.com",
    password: "stevespassword"
  }
];
const seed = async () => {
  await db.sync({ force: true });

  // seed your database here!
  await Promise.all(
    users.map(user => {
      return User.create(user);
    })
  );

  console.log(green("Seeding success!"));
  db.close();
};

seed().catch(err => {
  console.error(red("Seeding failed :("));
  console.error(err);
  db.close();
});
