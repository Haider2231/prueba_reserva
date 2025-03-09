const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET || "secreto_por_defecto";

// 🔍 Ruta para obtener todos los usuarios (prueba)
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en la base de datos");
  }
});

// 🔐 Ruta para registrar un usuario con contraseña encriptada
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    const nuevoUsuario = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, hashedPassword]
    );

    res.json(nuevoUsuario.rows[0]);
  } catch (err) {
    console.error("Error en el registro:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 🔑 Ruta de login y generación de token JWT
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // Buscar usuario en la base de datos
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (usuario.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const passwordValido = await bcrypt.compare(password, usuario.rows[0].password);

    if (!passwordValido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.rows[0].id, email: usuario.rows[0].email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 🔍 Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(403).json({ error: "Acceso denegado. No hay token." });
  }

  // Obtener solo el token (eliminar "Bearer ")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Formato de token incorrecto." });
  }

  try {
    const verificado = jwt.verify(token, jwtSecret);
    req.usuario = verificado;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// 📌 Ruta para crear una reserva (solo usuarios autenticados)
app.post("/reservas", verificarToken, async (req, res) => {
  try {
    const { sala, fecha, hora } = req.body;

    if (!sala || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // Insertar la reserva en la base de datos
    const nuevaReserva = await pool.query(
      "INSERT INTO reservas (usuario_id, sala, fecha, hora) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.usuario.id, sala, fecha, hora]
    );

    res.json(nuevaReserva.rows[0]);
  } catch (err) {
    console.error("Error en la reserva:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 📌 Ruta para obtener las reservas del usuario autenticado
app.get("/reservas", verificarToken, async (req, res) => {
  try {
    const reservas = await pool.query(
      "SELECT * FROM reservas WHERE usuario_id = $1",
      [req.usuario.id]
    );

    res.json(reservas.rows);
  } catch (err) {
    console.error("Error al obtener reservas:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando en Vercel!");
});

// 🚀 Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
