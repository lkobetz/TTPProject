const db = require("./server/db/db");
const { green, red } = require("chalk");
const User = require("./server/db/User");
const Transaction = require("./server/db/Transaction");

const users = [
  {
    name: "Steve",
    email: "steve@email.com",
    password: "stevespassword"
  }
];

const transactions = [
  {
    name: "cool stock",
    quantity: 5,
    price: 1000
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

  await Promise.all(
    transactions.map(trans => {
      return Transaction.create(trans);
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
