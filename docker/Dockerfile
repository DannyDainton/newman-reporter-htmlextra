FROM postman/newman

LABEL maintainer="Danny Dainton <dannydainton@gmail.com>"

RUN npm install -g newman-reporter-htmlextra

WORKDIR /etc/newman

ENTRYPOINT ["newman"]