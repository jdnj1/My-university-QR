# Especificamos la imagen base de Node.js
FROM node:19

# Establecemos el directorio de trabajo
WORKDIR app/frontend

# Install dependecies
COPY package*.json /app/frontend
RUN npm install
RUN npm install -g @angular/cli@16.0.5

# Copiamos los archivos de nuestra aplicacion
COPY . /app/frontend

#Exponemos el puerto 4200
EXPOSE 4200

# Definimos el comando para ejecutar la aplicacion
CMD ng serve --host 0.0.0.0

