const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});

const connection = mysql.createConnection({
    host:'localhost',
    user:'user',
    password:'123456',
    database:'relogios'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM dados_relogios";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'Cadastros de Relógios',
            relogios : rows
        });
    });
});

app.get('/edit/:id',(req,res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM dados_relogios where id = ${id}`;
    let query = connection.query(sql,(err,result) => {
        if(err) throw err;
        res.render('edit', {
            title: 'Editando Cadastro de Relógios',
            dados_relogios: result[0]
        });
    });
});

app.get('/delete/:id',(req,res) => {
    const id = req.params.id;
    let sql = `DELETE FROM dados_relogios where id = ${id}`;
    let query = connection.query(sql,(err,result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/add',(req, res) => {
    res.render('add', {
        title : 'Cadastros de Relógios'
    });
});

app.post('/save',(req,res) => {
    let data = {marca: req.body.marca};
    let sql = "insert into dados_relogios set ?";
    let query = connection.query(sql, data, (err, results) => {
        if(err) throw err
        res.redirect('/');
    });
});

app.post('/update',(req,res) => {
    const id = req.body.id;
    let sql = "update dados_relogios set marca = '" + req.body.marca + "' where id = " + id;
    let query = connection.query(sql, (err, results) => {
        if(err) throw err
        res.redirect('/');
    });
});

