-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-12-2023 a las 19:39:04
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `qr_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consult`
--

CREATE TABLE `consult` (
  `idConsult` int(11) NOT NULL,
  `name` varchar(250) NOT NULL DEFAULT 'Nombre de la llamada',
  `token` varchar(255) NOT NULL DEFAULT 'Token de la llamada',
  `typeDate` tinyint(4) NOT NULL DEFAULT 0,
  `dateFrom` timestamp NOT NULL DEFAULT current_timestamp(),
  `dateTo` timestamp NOT NULL DEFAULT current_timestamp(),
  `number` int(11) NOT NULL DEFAULT 0,
  `unit` tinyint(4) NOT NULL DEFAULT 1,
  `decimals` int(11) NOT NULL DEFAULT 2,
  `filters` longtext NOT NULL DEFAULT '{}',
  `operation` tinyint(4) NOT NULL DEFAULT 1,
  `chart` tinyint(4) NOT NULL DEFAULT 0,
  `colorVal` varchar(50) NOT NULL DEFAULT '#000000',
  `colorBack` varchar(50) NOT NULL DEFAULT '#ffffff',
  `icon` tinyint(4) NOT NULL DEFAULT 0,
  `activated` int(4) NOT NULL DEFAULT 0,
  `qrCode` int(11) NOT NULL,
  `orderConsult` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Estructura de tabla para la tabla `qrcode`
--

CREATE TABLE `qrcode` (
  `idQr` int(11) NOT NULL,
  `description` text NOT NULL DEFAULT 'Descripción del código QR',
  `tagName` varchar(250) NOT NULL DEFAULT 'Nombre de etiqueta',
  `tagDescription` varchar(250) NOT NULL DEFAULT 'Descripción de etiqueta',
  `sizePrint` varchar(4) NOT NULL DEFAULT 'a4',
  `date` date NOT NULL DEFAULT current_timestamp(),
  `activated` tinyint(4) NOT NULL DEFAULT 0,
  `share` tinyint(4) NOT NULL DEFAULT 0,
  `refresh` int(11) NOT NULL DEFAULT 0,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `idUser` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` tinyint(4) NOT NULL,
  `lim_consult` int(4) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indices de la tabla `consult`
--
ALTER TABLE `consult`
  ADD PRIMARY KEY (`idConsult`),
  ADD KEY `qrCode` (`qrCode`);

--
-- Indices de la tabla `qrcode`
--
ALTER TABLE `qrcode`
  ADD PRIMARY KEY (`idQr`),
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `email` (`email`);


--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `consult`
--
ALTER TABLE `consult`
  MODIFY `idConsult` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `qrcode`
--
ALTER TABLE `qrcode`
  MODIFY `idQr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`email`, `password`, `role`, `lim_consult`) VALUES
('userpass@gmail.com', '$2a$10$TpNX4WQ52y9nuAypqmrsqeVqbq5.YhjtEvQpqTwD8Sd1I5lx5nPNi', 1, 0);



--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `consult`
--
ALTER TABLE `consult`
  ADD CONSTRAINT `consult_ibfk_1` FOREIGN KEY (`qrCode`) REFERENCES `qrcode` (`idQr`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `qrcode`
--
ALTER TABLE `qrcode`
  ADD CONSTRAINT `qrcode_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
