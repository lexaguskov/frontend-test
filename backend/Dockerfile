# syntax=docker/dockerfile:experimental
FROM python:3.10.5

ENV LANG C.UTF-8

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y \
        gcc \
        ffmpeg \
        libsm6 \
        libxext6 \
        git \
        curl

RUN curl -sSL https://install.python-poetry.org | python3 - --version 1.5.1
ENV PATH="${PATH}:/root/.local/bin/"
RUN poetry config virtualenvs.in-project true

WORKDIR /app
COPY pyproject.toml .
COPY poetry.lock .

RUN mkdir ~/.ssh && chmod 700 ~/.ssh
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN --mount=type=ssh poetry install --no-root --only main

COPY app app

EXPOSE 80

ENTRYPOINT [ "poetry", "run", "python", "-m", "app.main" ]
CMD [ "--host", "0.0.0.0", "--port", "80", "--workers", "8" ]
