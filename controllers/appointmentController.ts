import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { db } from "../config/db.ts";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const SITE_KEY = env.SITE_KEY;

// === Submit an appointment (Public) ===
export const submitAppointment = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { name, phone, email, service, message, date, time } = await value;

    if (!name || !phone || !service || !date || !time) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Name, phone, service, date, and time are required.",
      };
      return;
    }

    const result = await db.execute(
      `INSERT INTO appointments 
      (name, phone, email, service, appointment_date, appointment_time, message, created_at, site_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [name, phone, email, service, date, time, message, SITE_KEY],
    );

    ctx.response.status = 201;
    ctx.response.body = {
      message: "Appointment submitted successfully!",
      appointmentId: result.lastInsertId, // Correct for MySQL insert response
    };
  } catch (error) {
    console.error("❌ Error submitting appointment:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to submit appointment" };
  }
};

// === Fetch all appointments (Admin-only) ===
export const fetchAppointments = async (ctx: Context) => {
  try {
    const appointments = await db.query(
      "SELECT * FROM appointments WHERE site_key = ? ORDER BY created_at DESC",
      [SITE_KEY],
    );

    ctx.response.status = 200;
    ctx.response.body = appointments;
  } catch (error) {
    console.error("❌ Error fetching appointments:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch appointments" };
  }
};

// === Delete appointment (Admin-only) ===
export const deleteAppointment = async (ctx: Context) => {
  const id = ctx.params.id;

  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Appointment ID is required" };
    return;
  }

  try {
    const result = await db.execute(
      "DELETE FROM appointments WHERE id = ? AND site_key = ?",
      [id, SITE_KEY],
    );

    if (result.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Appointment not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("❌ Error deleting appointment:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};