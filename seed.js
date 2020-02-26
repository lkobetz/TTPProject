const db = require("./server/db/db");
const { green, red } = require("chalk");
const { User } = require("./server/db/associations");
const { Transaction } = require("./server/db/associations");

const users = [
  {
    name: "Sarah",
    email: "sarah@email.com",
    password: "123"
  }
];

const transactions = [
  {
    name: "cool stock",
    quantity: 5,
    price: 100,
    userId: 1
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
