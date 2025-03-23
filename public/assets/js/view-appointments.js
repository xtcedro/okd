  const API_BASE_URL = window.location.origin.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://www.okdevs.xyz';

        async function fetchAppointments() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/appointments`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP! estado: ${response.status}`);
                }

                const appointments = await response.json();
                const appointmentsContainer = document.getElementById('appointments-container');
                appointmentsContainer.innerHTML = '';

                if (appointments.length === 0) {
                    appointmentsContainer.innerHTML = '<p class="no-appointments">No se encontraron citas. 📅</p>';
                    return;
                }

                appointments.forEach((appointment) => {
                    const appointmentCard = document.createElement('div');
                    appointmentCard.className = 'appointment-card';

                    const formattedDate = new Date(appointment.appointment_date).toLocaleDateString();
                    const formattedTime = appointment.appointment_time || 'No especificado';

                    appointmentCard.innerHTML = `
                        <h3>👤 ${appointment.name}</h3>
                        <p><strong>📧 Correo:</strong> ${appointment.email}</p>
                        <p><strong>📞 Teléfono:</strong> ${appointment.phone}</p>
                        <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
                        <p><strong>⏰ Hora:</strong> ${formattedTime}</p>
                        <p><strong>🛠️ Servicio:</strong> ${appointment.service || 'Servicio no especificado.'}</p>
                        <p><strong>💬 Detalles:</strong> ${appointment.message || 'No se proporcionaron detalles adicionales.'}</p>
                    `;

                    appointmentsContainer.appendChild(appointmentCard);
                });
            } catch (error) {
                const appointmentsContainer = document.getElementById('appointments-container');
                appointmentsContainer.innerHTML = `<p class="error-message">Error al obtener las citas: ${error.message}</p>`;
                console.error('Error al obtener las citas:', error);
            }
        }

        document.addEventListener('DOMContentLoaded', fetchAppointments);
