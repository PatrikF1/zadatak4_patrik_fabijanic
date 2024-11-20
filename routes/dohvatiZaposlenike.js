

import express, { json } from "express"
import fs from "fs/promises"
const router = express.Router();

router.get("/zaposlenici", async (req, res) => {
    let sortiraj_po_godinama = req.query.sortiraj_po_godinama;
    let pozicije_q = req.query.pozicija;
    let godine_staža_min = req.query.godine_staza_min;
    let godine_staža_max = req.query.godine_staza_max;


try {
    const data = await fs.readFile("zaposlenici.json", "utf8") 
   let zaposlenik = JSON.parse(data)
    

if(sortiraj_po_godinama) {
    if(sortiraj_po_godinama === 'uzlazno') {
        zaposlenik.sort((a,b) => a.godine_staza - b.godine_staza)
    }
    else if (sortiraj_po_godinama === 'silazno'){
        zaposlenik.sort((a,b) => b.godine_staza - a.godine_staza)
    }
    else {
        res.status(400).send("error")
    }
}


if(pozicije_q) {
    zaposlenik = zaposlenik.filter((z) => z.pozicija === pozicije_q)
}

if(godine_staža_min) {
    const minGod = JSON.parse(godine_staža_min)
    zaposlenik = zaposlenik.filter(z => z.godine_staza <= minGod)
    }


if(godine_staža_max) {
    const maxGod = JSON.parse(godine_staža_max)
    zaposlenik = zaposlenik.filter(z => z.godine_staza >= maxGod) 
    }

   res.status(200).json(zaposlenik)
    
} catch(error) {
    console.log("nesto je krivo", error);
    res.status(500).send("nije dobro dohvaceno")
}
});



router.get("/zaposlenici/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await fs.readFile("zaposlenici.json", "utf8")
        const zaposlenik = JSON.parse(data)

        const trazi = zaposlenik.find(z => z.id == id)

        if(trazi){
            res.status(200).json(trazi) 
        }
        else {
            res.status(400).send("ne postoji taj ID")
        }
         
    } catch(error) {
        console.log("nesto je krivo", error);
    res.status(500).send("nije dobro dohvaceno")
    }
})


router.post("/zaposlenici", async (req,res) => {
    const noviZaposlenik = req.body;
    try {
        const data = await fs.readFile("zaposlenici.json", "utf8")
        const zaposlenici = JSON.parse(data)
        let index = zaposlenici.length
        while(zaposlenici.find(z => z.id == index)){
            index++;
        }
            noviZaposlenik.id = index;
            zaposlenici.push(noviZaposlenik)
            res.status(200).send("OK")
        
        

        await fs.writeFile("zaposlenici.json",JSON.stringify(zaposlenici) ,"utf8")

        res.status(200).send(zaposlenici)

    } catch(error) {
        console.log("ne radi",error)
        res.status(400).send("ne dela")
    }
})




export default router;