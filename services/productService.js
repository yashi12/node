// Constants
const mongoose = require("mongoose");
const ExportToCsv = require("export-to-csv").ExportToCsv;
const fs = require("fs");
const Product = require('../models/product');
const ObjectsToCsv = require('objects-to-csv');

// Service to export a particular product's data to a CSV file
exportToCSV = async productId => {
    console.log("service")
    try {
        console.log("service")
        let result = await Product.findById(productId);
        let resp=[];
        resp.push(result._doc);

        const csv = new ObjectsToCsv(resp);
        await csv.toDisk(`productsData_${productId}.csv`);
        return { success: true, message: "Results saved in a CSV file" };
    } catch (err) {
        return { success: false, message: "Error in exporting to CSV file" };
    }
};

module.exports={
    exportToCSV:exportToCSV
}