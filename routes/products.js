const express = require("express");
const router = express.Router();
var fs = require("fs");

var readStream = fs.createReadStream("./db.json");

var productsData = [];
var mainCategory= {};

readStream.on("data", data => {
  productsData = JSON.parse(data);
});

router.post("/add", (req, res, next) => {
	let product = req.body;
	productsData.products.push(product);
	var writeStream = fs.createWriteStream("./db.json");
	writeStream.write(JSON.stringify(productsData), (err) => {
		if (err) throw err;
		else {
			res.status(200).json({
				message: "New product has been added successfully"
			});
		}
	})
});

// We have to pass query for the input as ' "id" : "1" or "productName": "Sony"
router.get("/view", (req, res, next) => {
	let id = req.query.id;
	let productName = req.query.productName;
	let idx;
	if (productName && !id) {
		idx = productsData.products.findIndex(p => p.productName.toLowerCase() == productName.toLowerCase());
	} else if (!productName && id){
		idx = productsData.products.findIndex(p => p.id.toLowerCase() == id.toLowerCase());
	}
	else {
		idx = productsData.products.findIndex(p => p.id.toLowerCase() == id).toLowerCase();
	}
	var product = productsData.products[idx];
	if (idx >= 0) {
		res.json({
			productDetails: product
		});
	} else res.json({
		Message: "No Data For this Product"
	});
});

router.post("/edit/:id", (req, res, next) => {
	let product = req.body;
	let id = req.params.id;
	let idx = productsData.products.findIndex(p => p.id == id);
	productsData.products[idx] = product;
	fs.writeFile('./db.json', JSON.stringify(productsData), (err) => {
		if (err) throw err
		else {
			if(idx>=0){
				res.status(200).json({
					message: 'You have updated the product with id ' + id
				});
			} else {
				res.json({
					message: 'No data Available with this id'
				});
			}
		}
	})

});

router.post("/delete/:id", (req, res, next) => {
	let id = req.params.id;
	let idx = productsData.products.findIndex(p => p.id == id);
	if (idx >= 0) {
		productsData.products.splice(idx, 1);
		fs.writeFile('./db.json', JSON.stringify(productsData), (err) => {
			if (err) throw err
			else {
				res.status(200).json({
					message: "Successfully deleted product with id: " + id
				});
			}
		})
	} else res.json({
		message: "No data Available with this id"
	})
});

router.get("/categoryWiseProducts", function(req, res) {
	var categoryArray = [];
	for (i = 0; i < productsData.products.length; i++) {
		categoryArray.push(productsData.products[i].category);
	}
	for (i = 0; i < categoryArray.length - 1; i++) {
		let CatObj = {};
		for (j = 1; j < categoryArray.length; j++) {
			if (categoryArray[i] == categoryArray[j]) {
				categoryArray.splice(j, j++);
			}
		}
	}

	for (i = 0; i < categoryArray.length; i++) {
		let CatObjvalue = [];
		let count = 0;
		for (j = 0; j < productsData.products.length; j++) {
			if (categoryArray[i] == productsData.products[j].category) {
				CatObjvalue[count] = productsData.products[j];
				count++;
			}
		}
	
		mainCategory[categoryArray[i].replace(/ /g,'')+"Products"] = CatObjvalue;
	}

	res.json({ categoryWiseProducts: mainCategory });
});

// This is search for product
// We have to pass query with ' "productName" : "String"
router.get("/search", (req, res, next) => {
	var searchResult = [];
	var param = req.query.productName.toLowerCase();
	if(param == ""){
		res.json({
			searchResult: productsData
		});
	}
	else{
		var arr = productsData.products;
		searchResult = arr.filter(obj => {
			return obj.productName.toString().toLowerCase().includes(param);
		})
		res.json({
			searchResult: searchResult
		});
	}
})


// This is global search for product or its properties
// We have to pass query with ' "value" : "String"
router.get("/globalSearch", (req, res, next) => {
	var globalSearchResult = [];
	var param = req.query.value.toLowerCase();
	if(param == ""){
		res.json({
			globalSearchResult: productsData
		});
	}

	var arr = productsData.products;
	globalSearchResult = arr.filter(obj => {
		return Object.keys(obj).some(function(key) {
			return obj[key].toString().toLowerCase().includes(param);
		});
	})

	if(globalSearchResult.length > 0){
		res.json({
			globalSearchResult: globalSearchResult
		});
	}else res.json({
		message: "No data available"
	})
})


module.exports = router;