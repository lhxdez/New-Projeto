const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({
    path: "node.env"
})

const app = express();

mongoose.connect(process.env.SERVER_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},);

app.use(express.json());
app.use(cors());

// Conexão com rotas
app.use(require('./routes'));

// Conexão com porta {SERVER_PORT} + Mensagem de confirmação
const server = require('http').Server(app);
server.listen(process.env.SERVER_PORT);

// Check da conexão após um delay {SERVER_CHECKDELAY} (milisegundos)
// 0-Disconectado /  1-Conectado / 2-Conectando / 3-Disconectando
setTimeout(()=>{
    if(mongoose.connection.readyState===1)
        console.log("Backend Conected")
}, process.env.SERVER_CHECKDELAY)