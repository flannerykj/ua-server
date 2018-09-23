FROM postgres:10.4
# Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
# then create a database `docker` owned by the ``docker`` role.
# Note: here we use ``&&\`` to run commands one after the other - the ``\``
#       allows the RUN command to span multiple lines.

ENV POSTGRES_ROOT_PASSWORD cheesecake

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
RUN echo "host all  all    0.0.0.0/0  md5" >> /var/lib/postgresql/data/pg_hba.conf

# And add ``listen_addresses`` to ``/etc/postgresql/9.3/main/postgresql.conf``
RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf
EXPOSE 5432
COPY init.sql /docker-entrypoint-initdb.d/

