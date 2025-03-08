import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    const data = await response.json();
    if (data.id) {
      alert("Registro exitoso!");
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
        <h2 className="text-center mb-4">Registro</h2>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" className="w-100">
          Registrarse
        </Button>
      </Form>
    </Container>
  );
}

export default Register;
