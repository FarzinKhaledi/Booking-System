const router = require('express').Router();
const mongoose = require('mongoose');
// const User = require('../models/User.model');
const Stylist = require('../models/Stylist.model ');
// const { isAuthenticated } = require('../middleware/jwt.middleware');

// POST /api/stylists  -  Creates a new Stylist
router.post('/stylists', (req, res, next) => {
  const { name, gender, email, appointments } = req.body;

  const newStylist = {
    name,
    gender,
    email,
    appointments,
  };

  Stylist.create(newStylist)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log('error creating a new Stylist...', err);
      res.status(500).json({
        message: 'error creating a new Stylist',
        error: err,
      });
    });
});

// GET /api/stylists  -  Get list of stylists
router.get('/stylists', (req, res, next) => {
  Stylist.find()
    .populate('appointments')
    .then((allStylists) => {
      res.json(allStylists);
    })
    .catch((err) => {
      console.log('error getting list of stylists...', err);
      res.status(500).json({
        message: 'error getting list of stylists',
        error: err,
      });
    });
});

// GET /api/stylists/:stylistId -  Retrieves a specific Stylist by id
router.get('/stylists/:stylistId', (req, res, next) => {
  const { stylistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(stylistId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  // Each Stylist document has `appointments` array holding `_id`s of Appointment documents
  // We use .populate() method to get swap the `_id`s for the actual Appointment documents
  Stylist.findById(stylistId)
    .populate('appointments')
    .then((Stylist) => res.json(Stylist))
    .catch((err) => {
      console.log('error getting Stylist details...', err);
      res.status(500).json({
        message: 'error getting Stylist details...',
        error: err,
      });
    });
});

// // PUT  /api/stylists/:stylistId  -  Updates a specific Stylist by id
// router.put('/stylists/:stylistId', isAuthenticated, (req, res, next) => {
//   const { stylistId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(stylistId)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }

//   Stylist.findOneAndUpdate(
//     { _id: stylistId, user: req.payload._id },
//     req.body,
//     { new: true }
//   )
//     .then((updatedStylist) => res.json(updatedStylist))
//     .catch((err) => {
//       console.log('error updating Stylist...', err);
//       res.status(500).json({
//         message: 'error updating Stylist...',
//         error: err,
//       });
//     });
// });

// // DELETE  /api/stylists/:stylistId  -  Deletes a specific Stylist by id
// router.delete('/stylists/:stylistId', isAuthenticated, (req, res, next) => {
//   const { stylistId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(stylistId)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }

//   Stylist.findByIdAndRemove(stylistId)
//     .then(() =>
//       res.json({
//         message: `Stylist with ${stylistId} is removed successfully.`,
//       })
//     )
//     .catch((err) => {
//       console.log('error deleting Stylist...', err);
//       res.status(500).json({
//         message: 'error deleting Stylist...',
//         error: err,
//       });
//     });
// });

module.exports = router;
