const UserService = require('../services/users');
const express = require('express');
const userRouter = express.Router();

// Create user
userRouter.post('/', (req, res) => {
  const { username, email } = req.body;
  const newUser = { username, email };
  if (req.body.pic) newUser.pic = req.body.pic;
  if (req.body.interests) newUser.interests = req.body.interests;
  if (req.body.events_attended) newUser.events_attended = req.body.events_attended;
  if (req.body.xp) newUser.xp = req.body.xp;

  UserService.createUser(newUser)
    .then(user => {
      res.json({ created: user });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
})

// Get user by id
userRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  UserService.getUserByID(id)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Get user by email
userRouter.get('/email/:email', (req, res) => {
  const { email } = req.params;
  UserService.getUserByEmail(email)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Update user by id
userRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  UserService.updateUserByID(id, req.body)
    .then(user => {
      res.json({ updated: user });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Delete user by id
userRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  UserService.deleteUser(id)
    .then(user => {
      res.json({ deleted: user });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

module.exports = userRouter;