# Imagen base de Nginx para servir el cliente del Ejercicio 3
FROM nginx:alpine

# Copiar archivos del proyecto al directorio público de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto HTTP estándar
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
