var express = require('express');
const Excel = require('exceljs');
const path = require('path');
const {fileParse} = require('../../utils/file');

var router = express.Router();
var workbook = new Excel.Workbook();

router.post('/upload', async function ( req, res, next ) {
    //  接收excel文件，保存到本地
    const result = await fileParse(req).catch(err => err);
    if(result.code === -1) res.json(result);

    //  exceljs解析文件成json
    workbook.xlsx.readFile(path.resolve(__dirname, '../../jewelery.xlsx')).then(function () {
        var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
        worksheet.eachRow(function (row, rowNumber) {
            // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
        });
    });

    //  把json按照shopify的文档上传到对应接口

    // res.send({success: true});
});

module.exports = router;
