var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require ("cli-table");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ZXCvbn11@',
  database : 'bamazondb'
});


      connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }

        console.log('connected as id ' + connection.threadId);
        start();
      });


function displayTable (){
  connection.query('SELECT * from products', function (error, results, fields) {
    if (error) throw error;

    var table = new Table({ //creating table object using Table constructor
        head: ['Item ID', 'Product Name', 'Department Name', 'Price', "Stock", "Sale"]
    });

    results.forEach(function (columns) { //loop throught database
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
     var obj = new Object; //temp object for table saving database values and push them into table
     obj[columns.item_id] = [columns.product_name, columns.department_name, "$"+columns.price, columns.stock, "$"+columns.product_sale];
     table.push(obj);
    });
    console.log(table.toString());
  });
}


function displayLowTable (){
  connection.query('SELECT * from products', function (error, results, fields) {
    if (error) throw error;

        var table = new Table({ //creating table object using Table constructor
            head: ['Item ID', 'Product Name', 'Department Name', 'Price', "Stock", "Sale"] //first row headers
        });

        results.forEach(function (columns) { //loop throught database
            if (columns.stock < 10){ //condition - inventory
              // table is an Array, so you can `push`, `unshift`, `splice` and friends
               var obj = new Object; //temp object for table saving database values and push them into table
               obj[columns.item_id] = [columns.product_name, columns.department_name, "$"+columns.price, columns.stock, "$"+columns.product_sale];
               table.push(obj);
            }
        });
        console.log(table.toString());
  });
}


function start(){
//menu for manager
  inquirer.prompt([
		{
			type: "list",
			name: "manager",
			message: "What would you like to do?",
			choices: ["view of products sale", "view low inventory", "add to inventory", "add new product"]
		}

		]).then(function(response){

        switch (response.manager){

          case "view of products sale":
              displayTable();
          break;

          case "view low inventory":
              displayLowTable();
          break;

          case "add to inventory":
              addStock();
          break;

          case "add new product":
              addNewProduct();
          break;
        }
		});

}


function addNewProduct(){
  inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "What item would you like to add?",
    },
    {
      type: "input",
      name: "department",
      message: "What department is your item?",
    },
    {
      type: "input",
      name: "price",
      message: "What is your item price?",
    },
    {
      type: "input",
      name: "stock",
      message: "How many items does your inventory have?",
    }
  ]).then(function(response){
          connection.query('INSERT INTO products SET ? ',
          {
            product_name: response.itemName,
            department_name: response.department,
            price: parseInt(response.price),
            stock: parseInt(response.stock)
          }
          , function (errors, result) {
            if (errors) throw errors;
            console.log("database updated ");
          }); //query function
        });// promt function then
}


function addStock (id, newStock){

  inquirer.prompt([
		{
			type: "input",
			name: "itemID",
			message: "Which item would you like to add?",
		},
    {
      type: "input",
      name: "quantity",
      message: "How many items would you like to add?",
    }
  ]).then(function(response){
    connection.query('SELECT * from products', function (error, res) {
      if (error) throw error;
      var newStock = res[parseInt(response.itemID)-1].stock + parseInt(response.quantity);
          connection.query('UPDATE products SET stock = ? WHERE item_id = ? ',[newStock, parseInt(response.itemID)], function (errors, result) {
            if (errors) throw errors;
            console.log("database updated ");
          }); // query update function
        });//query select function
    });//then function
}
