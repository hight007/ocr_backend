const express = require("express");
const router = express.Router();
const tesseract = require("node-tesseract-ocr")
const path = require('path')
const formidable = require('formidable-serverless');
const fs = require('fs-extra')
const Jimp = require('jimp');

//models
const orc_result = require('../database/models/ocr_result')

router.get("/ocr", async (req, res) => {
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    }
    console.log('OK');

    res.json({ config });
});

router.post("/ocr", async (req, res) => {
    try {
        // console.log('ocr start');
        const form = new formidable.IncomingForm();
        await form.parse(req, async (error, fields, files) => {
            if (!error) {

                // const img = await fs.readFileSync(files.image.path)
                await Jimp.read(files.image.path, async (err, image) => {
                    if (err) throw err;
                    let error_ = ""

                    image.quality(100).greyscale()
                    const img = await image.getBufferAsync(Jimp.MIME_JPEG)

                    // tesseract OCR 
                    let config = {
                        lang: "eng",
                        oem: 3,
                        psm: 3,
                        // tessedit_char_whitelist: '0123456789',
                    }
                    if (fields.isNumber) {
                        config.tessedit_char_whitelist = '0123456789'
                    }

                    const result = await tesseract.recognize(img, config)
                    // console.log(result);

                    processResult = result.trim()
                    processResult = processResult.replace(/[^a-zA-Z0-9]/g, "");

                    // remove img
                    await fs.unlinkSync(files.image.path);

                    // console.log('ocr result : ', processResult);

                    res.json({ result: processResult });
                });
            } else {
                console.log('error');
                console.log(error.toString());
                res.json({ error });
            }
        })
    } catch (errors) {
        console.log(errors);
        res.json({ errors });
    }

});

router.post('/record_ocr_result', async (req, res) => {
    try {
        console.log('ocr record');
        const form = new formidable.IncomingForm();
        await form.parse(req, async (error, fields, files) => {
            if (!error) {
                const ocr_result = fields.ocr_result
                const submit_result = fields.submit_result
                const image = await fs.readFileSync(files.image.path)

                console.log({
                    ocr_result,
                    submit_result,
                    image,
                });
                //record to db
                try {
                    await orc_result.create({
                        ocr_result,
                        submit_result,
                        image,
                    })

                } catch (error) {
                    console.log(error.toString());
                    res.json({ error });
                }

                // remove img
                fs.unlinkSync(files.image.path);

                res.json({ result: 'ok' });
            } else {
                console.log(error.toString());
                res.json({ error });
            }
        })
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
})

module.exports = router;
