import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Para redirigir después de iniciar sesión

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Guarda el token
        alert("Inicio de sesión exitoso!");
        navigate("/reservas"); // Redirige a la página de reservas
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo conectar al servidor.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
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
        <Button variant="primary" type="submit" className="w-100">
          Iniciar Sesión
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
