const express = require('express')
const app = express()
const port = 8080
const fs = require('fs')
const path = require('path')

app.use(express.static(__dirname + '/resurse'));

/// Task 8
app.get(['/', '/home', '/index'], (req, res) => {
  res.send(process.cwd())
})

//Task 18
app.get('/favicon.ico', (req, res)=>{
    res.sendFile(__dirname + '/resurse/ico/favicon.ico');
})

//Tasl 19
app.get('/:tip.ejs', (req, res)=>{
    res.render()
})



// Task 13 Variabila globala pentru erori
let obGlobal = {
    obErori: null
};

// Initializare erori
function initErori() {
    const eroriPath = path.join(__dirname, 'erori.json');
    const eroriData = fs.readFileSync(eroriPath);
    obGlobal.obErori = JSON.parse(eroriData);
    // Setare cale absoluta pentru imaginile de eroare
    obGlobal.obErori.info_erori.forEach(eroare => {
        eroare.imagine = path.join(__dirname, obGlobal.obErori.cale_baza, eroare.imagine);
    });
    obGlobal.obErori.eroare_default.imagine = path.join(__dirname, obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);
}

//Task 14 Afisare eroare
function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare;
    if (identificator) {
        eroare = obGlobal.obErori.info_erori.find(e => e.identificator === identificator) || obGlobal.obErori.eroare_default;
    } else {
        eroare = obGlobal.obErori.eroare_default;
    }
    if (titlu) eroare.titlu = titlu;
    if (text) eroare.text = text;
    if (imagine) eroare.imagine = imagine;
    res.render('eroare.ejs', { eroare: eroare });
}

// Initializare erori la pornirea serverului
initErori();

//Task 15 pagina de descriere
// Pagina de descriere a site-ului
app.get('/descriere', (req, res) => {
    res.render('descriereSite.ejs');
});



//Task 9
app.get('/:pagina', (req, res) => {
    const pagina = req.params.pagina;
    if(fs.existsSync(pagina)){
        res.render(`${pagina}.ejs`);    
    }
    else{
        res.render((err, html) => {
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    const eroare404 = eroriJSON.info_erori.find(e => e.identificator === 404) || eroriJSON.eroare_default;
                    return res.status(404).render('error404.ejs', { eroare: eroare404 });
                } else {
                    const eroareGenerica = eroriJSON.eroare_default;
                    return res.status(500).render('errorGeneric.ejs', { eroare: eroareGenerica });
                    }
                }
            res.send(html);
            })
    }});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});