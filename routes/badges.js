const BadgeService = require('../services/badges');
const express = require('express');
const badgeRouter = express.Router();

// Create badge
badgeRouter.post('/', (req, res) => {
  const { badge_name, badge_description, badge_xp_value, badge_image } = req.body;

  BadgeService.createBadge({ badge_name, badge_description, badge_xp_value, badge_image })
    .then(badge => {
      res.json({ created: badge });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Get badge by id
badgeRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  BadgeService.getBadgeByID(id)
    .then(badge => {
      res.json(badge);
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Update badge by id
badgeRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { badge_name, badge_description, badge_xp_value, badge_image } = req.body;
  BadgeService.updateBadgeByID(id, { badge_name, badge_description, badge_xp_value, badge_image })
    .then(badge => {
      res.json({ updated: badge });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

// Delete badge by id
badgeRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  BadgeService.deleteBadge(id)
    .then(badge => {
      res.json({ deleted: badge });
    })
    .catch(err => {
      res.status(404).json({ Error: err });
    });
});

module.exports = badgeRouter;