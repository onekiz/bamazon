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
  //first display all items to buyer and then prompt options
  displayTable();
});

function displayTable (){
  connection.query('SELECT * from products', function (error, results, fields) {
    if (error) throw error;

        var table = new Table({  //creating new Table obj
            head: ['Item ID', 'Product Name', 'Department Name', 'Price', "Stock"]
        });

        results.forEach(function (columns) { //going through database
        // table is an Array, so you can `push`, `unshift`, `splice` and friends
         var obj = new Object; //temp object to hold database data
         obj[columns.item_id] = [columns.product_name, columns.department_name, "$"+columns.price, columns.stock];
         table.push(obj);
        });
        console.log(table.toString());
        selectItem(); //prompt function
      });
}





function selectItem(){
    inquirer.prompt([
      	{
      		type: "input",
      		name: "itemID",
      		message: "Please enter an item-id you would like to purchase?",
      	},
      	{
      		type: "input",
      		name: "quantity",
      		message: "How many items would you like to buy?",
      	}

      	]).then(function(response){

          connection.query('SELECT * from products where item_id = ? ', [parseInt(response.itemID)], function (err, reso) {
            if (err) throw err;
              if (reso[0].stock >= parseInt(response.quantity)){
                 var newStock = reso[0].stock - parseInt(response.quantity);
                 var sale = parseFloat(response.quantity)*reso[0].price;
                 updateTable(newStock, sale, parseInt(response.itemID));
              }
              else if (reso[0].stock < parseInt(response.quantity)){
                 console.log("not enough item on stock!!!");
              }
          }); // close query function

  	}); //close first inquirer then funciton
}





function updateTable (newStock,sale,id){
  connection.query('UPDATE products SET stock = ?, product_sale = ? WHERE item_id = ? ',[newStock, sale, id], function (errors, result) {
    if (errors) throw errors;
    console.log("database updated ");
  });
}
