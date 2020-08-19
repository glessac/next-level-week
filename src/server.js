const express = require("express") // chamando o express instalado
const server = express() //executando a funçcao criada

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta public p ser reconhecido pelo servidor
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))

//usando o template engine - nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
}) // primeiro argumento é a pasta que vai usar, segundo é um objeto

//configrar os caminhos da aplicação
//pag inicial. req = requisiçao, res = resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "bla" })
})

//create-point
server.get("/create-point", (req, res) => {

    //req.query: Query Strings da nossa url, o que aparece na barra apos enviar o formulario preenchido

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    //req.body: O corpo do formulario - inserir os dados no banco do font p back
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);

    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})




server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        //pesquisa vazia
        return res.render("search-results.html", { total: 0})

    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
       if(err) {
           return console.log(err)
       }

       const total = rows.length

       //mostrar a pag html com os dados do banco de dados
       return res.render("search-results.html", { places: rows, total: total})
    })
})

//ligar o servidor
server.listen(3000) //vai abrir na porta 3000