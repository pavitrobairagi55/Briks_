
FROM nginx:1.16.0-alpine
# COPY .env.prod /usr/share/nginx/html/.env
COPY dist/  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d
RUN mv  /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.old
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
