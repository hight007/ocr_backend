const express = require("express");
const cors = require('cors')

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use("/api/", require("./api/api_orc"))

app.listen(2005, () => {
    console.log("Backend is running...");
});

// exports.ocr = app