import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const API_URL = "https://backend-3bys28lr7-haiderandres1369-gmailcoms-projects.vercel.app"; // URL del backend en Vercel

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas antes de enviar la solicitud
    if (!nombre || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso! Ahora puedes iniciar sesión.");
      } else {
        alert("Error: " + (data.error || "No se pudo registrar el usuario."));
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo conectar al servidor. Inténtalo de nuevo más tarde.");
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
