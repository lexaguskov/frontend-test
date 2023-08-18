# Assignment

Build a simple frontend based on this boilerplate for these user stories:

1. User should be able to navigate between drone images
2. User should be able to zoom and pan a drone image
3. User should be able to add a point of interest with a comment

Estimated time: 4-6 hours

## Things we will look at

1. Maintainability of code
2. Readability of code
3. Intuitiveness of the interface
4. Responsiveness of the interface

## Drone images

Download the drone images and put them in `data/images`.

https://drive.google.com/file/d/1qOKw0ReDYCPlEE8uP9lveBbISFxiW5jO/view?usp=sharing

## Development

```bash
docker compose up --build
```

You will find the backend on `localhost:8000` and the frontend on `localhost:3000`.

### Backend

We recommend using pyenv and poetry to manage your python environment.

- https://github.com/pyenv/pyenv
- https://github.com/python-poetry/poetry

After installing you can add new dependencies with

```bash
cd backend && poetry add <dependency>
```
