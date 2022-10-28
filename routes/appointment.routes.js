const router = require('express').Router();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment.model');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

// POST /api/appointments  -  Creates a new Appointment
router.post('/appointments', (req, res, next) => {
  const { services, durationInMinutes, userId, stylistId } = req.body;
  let price = 0;
  const date = new Date(req.body.date);
  services.forEach((element) => {
    switch (element) {
      case "jen's haircut":
        price += 20;
        break;
      case "lady's haircut":
        price += 20;
        break;
      case 'beard trim':
        price += 10;
        break;
      case 'color':
        price += 15;
        break;
      case "Kid's haircut":
        price += 10;
        break;

      default:
        'the servise is not exist';
        break;
    }
  });

  const newAppointment = {
    services,
    price,
    durationInMinutes,
    date,
    stylistId: stylistId,
    userId: userId,
  };

  Appointment.create(newAppointment)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log('error creating a new Appointment...', err);
      res.status(500).json({
        message: 'error creating a new Appointment',
        error: err,
      });
    });
});

// GET /api/appointments  -  Get list of appointments
router.get('/appointments', (req, res, next) => {
  Appointment.find()
    .populate('services')
    .then((allAppointments) => {
      res.json(allAppointments);
    })
    .catch((err) => {
      console.log('error getting list of appointments...', err);
      res.status(500).json({
        message: 'error getting list of appointments',
        error: err,
      });
    });
});

// GET /api/appointments/:appointmentId -  Retrieves a specific Appointment by id
router.get('/appointments/:appointmentId', (req, res, next) => {
  const { appointmentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  // Each Appointment document has `services` array holding `_id`s of Service documents
  // We use .populate() method to get swap the `_id`s for the actual Service documents
  Appointment.findById(appointmentId)
    .populate('services')
    .then((Appointment) => res.json(Appointment))
    .catch((err) => {
      console.log('error getting Appointment details...', err);
      res.status(500).json({
        message: 'error getting Appointment details...',
        error: err,
      });
    });
});

// PUT  /api/appointments/:appointmentId  -  Updates a specific Appointment by id
router.put(
  '/appointments/:appointmentId',
  isAuthenticated,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }

    Appointment.findOneAndUpdate(
      { _id: appointmentId, user: req.payload._id },
      req.body,
      { new: true }
    )
      .then((updatedAppointment) => res.json(updatedAppointment))
      .catch((err) => {
        console.log('error updating Appointment...', err);
        res.status(500).json({
          message: 'error updating Appointment...',
          error: err,
        });
      });
  }
);

// DELETE  /api/appointments/:appointmentId  -  Deletes a specific Appointment by id
router.delete(
  '/appointments/:appointmentId',
  isAuthenticated,
  (req, res, next) => {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }

    Appointment.findByIdAndRemove(appointmentId)
      .then(() =>
        res.json({
          message: `Appointment with ${appointmentId} is removed successfully.`,
        })
      )
      .catch((err) => {
        console.log('error deleting Appointment...', err);
        res.status(500).json({
          message: 'error deleting Appointment...',
          error: err,
        });
      });
  }
);

module.exports = router;
