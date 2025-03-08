import { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";

function Reservas() {
  const [sala, setSala] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [reservas, setReservas] = useState([]);

  // Función para obtener las reservas del usuario
  const fetchReservas = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/reservas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setReservas(data);
  };

  useEffect(() => {
    fetchReservas(); // Cargar reservas al entrar a la página
  }, []);

  // Función para hacer una reserva
  const handleReserva = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sala, fecha, hora }),
    });

    if (response.ok) {
      alert("Reserva realizada con éxito!");
      fetchReservas(); // Recargar las reservas
    } else {
      alert("Error al reservar");
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
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>{reserva.sala}</td>
              <td>{reserva.fecha}</td>
              <td>{reserva.hora}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Reservas;
