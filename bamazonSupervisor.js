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
  connection.query("select products.item_id, products.product_name, departments.department_name, departments.over_head_costs, products.product_sale from products, departments where products.department_name = departments.department_name", function (error, res) {
    if (error) throw error;

      var table = new Table({ //creating table object , constructor Table
          head: ['Item ID', 'Product Name', 'Department Name', 'Over Head Costs', "Sale", "Profit"] //first row header
      });

      res.forEach(function (columns) { //looping through database
        // table is an Array, so you can `push`, `unshift`, `splice` and friends
         var profit = columns.product_sale - columns.over_head_costs; //calculating profit
         var obj = new Object; //temp obj will be pushed into table obj we created
         obj[columns.item_id] = [columns.product_name, columns.department_name, "$"+columns.over_head_costs, "$"+columns.product_sale, "$" + profit];
         table.push(obj);
      });
      console.log(table.toString());
  });
}




function start(){
  inquirer.prompt([
		{
			type: "list",
			name: "manager",
			message: "What would you like to do?",
			choices: ["view products sales by department", "create a new department"]
		}

		]).then(function(response){

        switch (response.manager){

          case "view products sales by department":
              displayTable();
          break;

          case "create a new department":
              createDepartment();
          break;

          default:
          console.log("no valid entry!!!");
          break;
        }
		});
}



function createDepartment(){
  inquirer.prompt([

    {
      type: "input",
      name: "department",
      message: "What department is your item?",
    },
    {
      type: "input",
      name: "cost",
      message: "What is the cost of the items?",
    }
  ]).then(function(response){
          connection.query('INSERT INTO departments SET ? ',
          {
            department_name: response.department,
            over_head_costs: parseFloat(response.cost),
          }
          , function (errors, result) {
            if (errors) throw errors;
            console.log("database updated ");
          }); //query function
        });// promt function then
}
