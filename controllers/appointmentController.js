import { db } from "../config/db.js";

// Submit an appointment
export const submitAppointment = async (req, res) => {
    try {
        const { name, phone, email, service, message } = req.body;

        if (!name || !phone || !email || !service) {
            return res.status(400).json({ error: "All required fields must be filled." });
        }

        // Insert appointment into the database (use `created_at` instead of `appointment_date`)
        const [result] = await db.execute(
            "INSERT INTO appointments (name, phone, email, service, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [name, phone, email, service, message]
        );

        res.status(201).json({ message: "Appointment submitted successfully!", appointmentId: result.insertId });
    } catch (error) {
        console.error("Error submitting appointment:", error);
        res.status(500).json({ error: "Failed to submit appointment" });
    }
};

// Fetch all appointments
export const fetchAppointments = async (req, res) => {
    try {
        // Change `appointment_date` to `created_at` if `appointment_date` is removed
        const [appointments] = await db.execute("SELECT * FROM appointments ORDER BY created_at DESC");

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
};