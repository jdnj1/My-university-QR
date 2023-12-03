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
-- Volcado de datos para la tabla `consult`
--

INSERT INTO `consult` (`idConsult`, `name`, `token`, `typeDate`, `dateFrom`, `dateTo`, `number`, `unit`, `decimals`, `filters`, `operation`, `chart`, `colorVal`, `colorBack`, `icon`, `activated`, `qrCode`, `orderConsult`) VALUES
(1, 'Consumo eléctrico del sensor MLU00040001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-05-19 03:00:00', '2023-05-19 05:00:00', 0, 1, 2, '{\"uid\":\"MLU00040001\",\"name\":\"15m\"}', 2, 3, '#ffffff', '#ee7777', 0, 1, 3, 2),
(6, 'Gráfica de líneas con dos sensores pru', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-07-06 12:21:30', '2023-07-27 12:21:30', 0, 1, 2, '{\"uid\":\"MLU00040001,MLU02000002\",\"name\":\"15m\"}', 1, 0, '', '', 0, 1, 3, 4),
(8, 'Gráfica de barras 2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-07-05 22:00:00', '2023-07-06 22:00:00', 0, 1, 2, '{\"uid\":\"MLU00080001,MLU00090001,MLU00200002\",\"name\":\"15m\"}', 1, 1, '', '', 0, 1, 3, 0),
(135, 'Temperatura', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 12:27:40', '2023-12-14 12:27:40', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"Temperatura\"}', 4, 3, '#000000', '#ffffff', 0, 1, 270, 0),
(136, 'Humedad', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 12:28:29', '2023-12-14 12:28:29', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"Humedad\"}', 4, 3, '#000000', '#ffffff', 0, 1, 270, 1),
(137, 'CO2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 12:28:29', '2023-12-14 12:28:29', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"CO2\"}', 4, 3, '#000000', '#ffffff', 0, 1, 270, 2),
(138, 'VocIndex', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 12:28:29', '2023-12-14 12:28:29', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"VocIndex\"}', 4, 3, '#000000', '#ffffff', 0, 1, 270, 3),
(211, 'Temperatura', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 11:27:40', '2023-12-14 11:27:40', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"Temperatura\"}', 4, 3, '#000000', '#ffffff', 0, 1, 298, 0),
(212, 'Humedad', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 11:28:29', '2023-12-14 11:28:29', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"Humedad\"}', 4, 3, '#000000', '#ffffff', 0, 0, 298, 1),
(213, 'CO2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 11:28:29', '2023-12-14 11:28:29', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"CO2\"}', 4, 3, '#000000', '#ffffff', 0, 0, 298, 2),
(214, 'VocIndex', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyNTM5MTR9.jHNbXYKMk-errnM3IgEydWjQ1BICJBCwmhWXcUKPIL4', 1, '2023-11-29 11:28:29', '2023-12-14 11:28:29', 60, 2, 2, '{\"uid\":\"sensor-voc-1\",\"name\":\"VocIndex\"}', 4, 3, '#000000', '#ffffff', 0, 0, 298, 3),
(216, 'Consumo eléctrico del sensor MLU00040001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-05-19 03:00:00', '2023-05-19 05:00:00', 0, 1, 2, '{\"uid\":\"MLU00040001\",\"name\":\"15m\"}', 3, 2, '#ffffff', '#77caee', 3, 1, 3, 3),
(217, 'Consumo eléctrico del sensor MLU00040001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-05-19 03:00:00', '2023-05-19 05:00:00', 0, 1, 2, '{\"uid\":\"MLU00040001\",\"name\":\"15m\"}', 4, 3, '#ffffff', '#777fee', 0, 1, 3, 3);

-- --------------------------------------------------------

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
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `qrcode`
--

INSERT INTO `qrcode` (`idQr`, `description`, `tagName`, `tagDescription`, `sizePrint`, `date`, `activated`, `share`, `user`) VALUES
(3, 'Consumo electrónico', 'Primer QR', 'Prueba', 'a4', '2023-12-29', 1, 0, 10),
(270, 'VOC1', 'VOC1', 'VOC1', 'a4', '2030-01-01', 1, 1, 4),
(298, 'VOC1 (copia)', 'VOC1', 'VOC1', 'a4', '2030-01-01', 0, 1, 4);

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
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`idUser`, `email`, `password`, `role`, `lim_consult`) VALUES
(2, 'jd@gmail.com', '$2a$10$/etleNsk6r0uucYHj1INzeSLUyrNRY6be74Dmml5NjI27Qt0znMFS', 1, 10),
(4, 'userpass@gmail.com', '$2a$10$TpNX4WQ52y9nuAypqmrsqeVqbq5.YhjtEvQpqTwD8Sd1I5lx5nPNi', 1, 0),
(10, 'pru2@gmail.com', '$2a$10$auaD6riZEuiFCl55gHcae.9RSKAnT89UtVdTslU54ujJP/QUojJaG', 0, 10),
(39, 'jvberna@ua.es', '$2a$10$fg6/CIveADkDugAdYBsFdO6XcxYkz7KPrZvOn3ZPxSnx395e9ys8i', 1, 0);

--
-- Índices para tablas volcadas
--

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
  MODIFY `idConsult` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT de la tabla `qrcode`
--
ALTER TABLE `qrcode`
  MODIFY `idQr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=299;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

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
