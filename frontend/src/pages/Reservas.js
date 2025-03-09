import { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";

const API_URL = "https://backend-3bys28lr7-haiderandres1369-gmailcoms-projects.vercel.app"; // URL del backend en Vercel

function Reservas() {
  const [sala, setSala] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [reservas, setReservas] = useState([]);

  // Función para obtener las reservas del usuario
  const fetchReservas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para ver tus reservas.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setReservas(data);
      } else {
        alert("Error al obtener reservas: " + (data.error || "Inténtalo más tarde."));
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo conectar al servidor.");
    }
  };

  useEffect(() => {
    fetchReservas(); // Cargar reservas al entrar a la página
  }, []);

  // Función para hacer una reserva
  const handleReserva = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para hacer una reserva.");
      return;
    }

    // Validar que la fecha y hora sean futuras
    const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
    const fechaHoraActual = new Date();
    if (fechaHoraSeleccionada <= fechaHoraActual) {
      alert("La fecha y hora deben ser futuras.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sala, fecha, hora }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Reserva realizada con éxito!");
        fetchReservas(); // Recargar las reservas
      } else {
        alert("Error al reservar: " + (data.error || "Inténtalo más tarde."));
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo conectar al servidor.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Reservar una Sala</h2>
      <Form onSubmit={handleReserva} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Sala</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ejemplo: Sala A"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hora</Form.Label>
          <Form.Control
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Reservar
        </Button>
      </Form>

      <h3>Mis Reservas</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sala</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length > 0 ? (
            reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.sala}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No tienes reservas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default Reservas;
