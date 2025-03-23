const validateAppointment = (req, res, next) => {
    const { name, phone, email, appointment_date, appointment_time, service } = req.body;

    if (!name || !phone || !email || !appointment_date || !appointment_time || !service) {
        return res.status(400).send('All fields are required.');
    }

    // Additional validations (e.g., phone number format) can go here
    next();
};

module.exports = { validateAppointment };