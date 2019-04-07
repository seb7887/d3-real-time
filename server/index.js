const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const chalk = require('chalk');

const market = require('./market');

const app = express();
const port = parseInt(7777, 10);

const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

app.get('/api/market', (req, res) => {
  res.send(market.marketPositions);
});

io.on('connection', socket => {
  console.log(chalk.cyan('Client connected'));

  setInterval(() => {
    market.updateMarket();
    socket.emit('market', market.marketPositions[0]);
  }, 5000);

  socket.on('disconnect', () => {
    console.log(chalk.cyan('Client disconnected'));
  });
});

server.listen(port, () => {
  console.log(chalk.bgGreen.black(`Server listening on ${port}`));
});