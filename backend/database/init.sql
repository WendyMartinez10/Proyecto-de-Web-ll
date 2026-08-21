CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  encargado VARCHAR(150)
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(150) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  departamento_id INT,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL DEFAULT 1,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id),
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE sesiones (
  session_id VARCHAR(128) PRIMARY KEY,
  expires INT UNSIGNED NOT NULL,
  data TEXT
);

CREATE TABLE dispositivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identificador VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(100),
  descripcion VARCHAR(255),
  usuario_id INT NOT NULL,
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  tipo ENUM('entrada','salida') NOT NULL,
  ip VARCHAR(45),
  dispositivo_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
);

CREATE TABLE equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NOT NULL,
  imagen VARCHAR(255),
  estado ENUM('disponible','prestado','mantenimiento','inactivo') DEFAULT 'disponible'
);

CREATE TABLE prestamos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_prestamo VARCHAR(30) NOT NULL UNIQUE,
  usuario_id INT NOT NULL,
  encargado_id INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('activo','finalizado') DEFAULT 'activo',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (encargado_id) REFERENCES usuarios(id)
);

CREATE TABLE prestamo_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestamo_id INT NOT NULL,
  equipo_id INT NOT NULL,
  estado_devolucion ENUM('pendiente','devuelto') DEFAULT 'pendiente',
  fecha_devolucion DATETIME NULL,
  FOREIGN KEY (prestamo_id) REFERENCES prestamos(id),
  FOREIGN KEY (equipo_id) REFERENCES equipos(id)
);

CREATE TABLE configuracion (
  clave VARCHAR(50) PRIMARY KEY,
  valor VARCHAR(255) NOT NULL
);

CREATE TABLE tokens_recuperacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expira_en DATETIME NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO roles (nombre) VALUES ('usuario'), ('administrador');
INSERT INTO configuracion (clave, valor) VALUES
  ('nombre_institucion', 'UTN Sede Guanacaste'),
  ('rango_ip_permitido', '0.0.0.0/0'),
  ('tiempo_max_sesion_min', '60'),
  ('tamano_max_archivo_mb', '5');

-- Departamento inicial para poder registrar usuarios desde el primer arranque
INSERT INTO departamentos (nombre, descripcion, encargado) VALUES
  ('Ingeniería en Tecnologías de Información', 'Carrera de TI, Sede Guanacaste', 'Juan Pablo Rodriguez B.');

-- Usuario administrador semilla.
-- Usuario: admin | Correo: admin@utn.ac.cr | Contraseña: Admin123
-- (la contraseña ya está almacenada con hash bcrypt, nunca en texto plano)
INSERT INTO usuarios (nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password_hash, rol_id) VALUES
  ('Administrador del Sistema', '1990-01-01', 'admin@utn.ac.cr', 1, 'admin', '$2b$10$TxwqeMh3sP5Bf7IphniCeOPCONSY4W2EmohJm.PQc0.sQj.8ekbay', 2);
