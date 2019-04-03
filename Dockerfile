FROM httpd:2.4-alpine
LABEL maintainer="georg.wittberger@gmail.com"
COPY src/docker/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY dist/skoop-webapp /usr/local/apache2/htdocs/
EXPOSE 80
