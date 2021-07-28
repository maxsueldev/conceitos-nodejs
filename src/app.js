const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repository Id' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositorieId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  const results = title ? repositories.filter(repositorie => repositorie.title.includes(title)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;

  const repositorie = { id: uuid(), title, url, techs, likes };

  repositories.push(repositorie);
  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  const likes = repositories[repositorieIndex].likes;

  const repositorie = { id, title, url, techs, likes};

  repositories[repositorieIndex] = repositorie;
  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  const { likes, title, url, techs } = repositories[repositorieIndex];

  likes+= 1;

  const repositorie = { id, title, url, techs, likes };

  return response.json(repositorie);
});

module.exports = app;
