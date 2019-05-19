const AwardService = require('../services/awards');
const express = require('express');
const awardRouter = express.Router();

// Create award
awardRouter.post('/', (req, res) => {
  const { user_id, badge_id } = req.body;

  AwardService.createAward({ user_id, badge_id })
    .then(award => {
      res.json({ created: award });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Get award by id
awardRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  AwardService.getAwardByID(id)
    .then(award => {
      res.json(award);
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Update award by id
awardRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, badge_id } = req.body;
  AwardService.updateAwardByID(id, { user_id, badge_id })
    .then(award => {
      res.json({ updated: award });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Delete award by id
awardRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  AwardService.deleteAwardByID(id)
    .then(award => {
      res.json({ deleted: award });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

module.exports = awardRouter;
