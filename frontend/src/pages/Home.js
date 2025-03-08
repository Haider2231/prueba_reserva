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

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("token"); // Eliminar el token
    setAutenticado(false); // Actualizar el estado
    navigate("/"); // Redirigir al Home
  };

  return (
    <Container className="text-center mt-5">
      <h1>Bienvenido a la App de Reservas</h1>
      <p>Gestiona tus reservas de salas de manera fácil y rápida.</p>

      {autenticado ? (
        <>
          <Button variant="success" onClick={() => navigate("/reservas")} className="m-2">
            Ir a Reservas
          </Button>
          <Button variant="danger" onClick={cerrarSesion} className="m-2">
            Cerrar Sesión
          </Button>
        </>
      ) : (
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
