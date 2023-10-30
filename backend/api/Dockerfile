# Especificamos la imagen base de Node.js
FROM node:19

# Establecemos el directorio de trabajo
WORKDIR app/api

# Install dependecies
COPY package*.json /app/api
RUN npm install

# Copiamos los archivos de nuestra aplicacion
COPY . /app/api

#Exponemos el puerto 3000
EXPOSE 3000

# Definimos el comando para ejecutar la aplicacion
CMD ["npm", "start"]

