# My University QR

Este proyecto ha sido generado con [Angular CLI](https://github.com/angular/angular-cli) versión 16 a partir de la plantilla .

## Instrucciones para arrancar la aplicación en local
A continuación se indican una serie de pasos para la instalación del proyecto en el equipo. Hay dos métodos para poder realizarlo pero en ambos casos es necesaria la creación de un archivo **.env** con las variables de entorno facilitadas en el archivo **variablesEnt.txt** dentro de la carpeta **backend**.

Usuario de prueba para acceder a la parte privada de la aplicación:
- Email: userpass@gmail.com
- Contraseña: 12345

El primer paso en los dos métodos es clonar este repositorio: 
`git clone https://github.com/jdnj1/My-university-QR.git`

### Primer método (XAMPP)

1. Tener instalado [XAMPP](https://www.apachefriends.org/es/download.html) en el equipo.

2. Iniciar el panel de control de XAMPP y activar Apache y MySQL.

3. Crear una nueva base de datos con el nombre de **qr_app** en [phpMyAdmin](http://localhost/phpmyadmin/) e importar el script SQL ubicado en la carpeta **bd** dentro de **backend**.

4. Navegar a la carpeta de la API desde una terminal: `cd backend/api`.

5. Instalar las dependencias: `npm install`.

6. Ejecutar la API: `nodemon`.

7. Navegar a la carpeta del Frontend desde otra terminal: `cd frontend`.

8. Instalar las dependencias: `npm install`.

9. Ejecutar el frontend: `ng serve`.

10. Dirigirse a `http://localhost:4200/` en tu navegador para ver la aplicación en funcionamiento.

### Segundo método (Docker)

1. En el archivo de las variables de entorno, cambiar la variable **HOST** de **localhost** a **mariadb**.

2. Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) en el equipo.

3. Navegar a la carpeta **Docker** del repositorio: `cd Docker`.

4. Ejecutar el siguiente comando en la terminal: `docker-compose up -d`.

5. En la pestaña de los contenedores de Docker Desktop aparecera un nuevo grupo de contenedores.

6. Si el contenedor de la API no se ha ejecutado correctamente, pulsar manualmente en el botón de iniciar.

7. Dirigirse a `http://localhost:4200/` en tu navegador para ver la aplicación en funcionamiento.