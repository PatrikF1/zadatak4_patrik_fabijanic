import express from "express";
import dohvatiZ from "./routes/dohvatiZaposlenike.js"
const app = express();

app.use(express.json())


const PORT = 3000;


app.get("/zaposlenici", dohvatiZ);

app.get("/zaposlenici/:id", dohvatiZ);

app.post("/zaposlenici", dohvatiZ);

app.listen(PORT, Error => {
if(Error) {
    console.log("server ne radi")
}
else {
    console.log("server radi")
}
})

