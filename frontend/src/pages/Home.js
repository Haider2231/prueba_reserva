import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAutenticado(true);
    }
  }, []);

  return (
    <Container className="text-center mt-5">
      <h1>Bienvenido a la App de Reservas</h1>
      <p>Gestiona tus reservas de salas de manera fácil y rápida.</p>

      {/* Si el usuario está autenticado, botón para ir a reservas */}
      {autenticado ? (
        <Button variant="success" onClick={() => navigate("/reservas")} className="m-2">
          Ir a Reservas
        </Button>
      ) : (
        // Si el usuario no está autenticado, botones para Login y Registro
        <>
          <Button variant="primary" onClick={() => navigate("/login")} className="m-2">
            Iniciar Sesión
          </Button>
          <Button variant="secondary" onClick={() => navigate("/register")} className="m-2">
            Registrarse
          </Button>
        </>
      )}
    </Container>
  );
}

export default Home;
