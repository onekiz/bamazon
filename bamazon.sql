create database bamazondb;

use bamazondb;

create table products(
item_id integer(20) auto_increment unique,
product_name varchar(50) not null,
department_name varchar(50) not null,
price float(50,2) not null,
stock integer(50) not null default 0,
primary key(item_id)
);

insert into products(product_name, department_name, price, stock)
values ("food processor", "kitchen and dinning", 55, 10);
insert into products(product_name, department_name, price, stock)
values ("external battery power", "electronics", 35, 96);
insert into products(product_name, department_name, price, stock)
values ("gym bag", "luggage and travel gear", 65, 151);
insert into products(product_name, department_name, price, stock)
values ("hair cut kit", "beuaty and personal care", 35, 58);
insert into products(product_name, department_name, price, stock)
values ("lace-up boots", "clothing", 155, 2);
insert into products(product_name, department_name, price, stock)
values ("sewing machines", "arts crafts and sewing", 255, 11);
insert into products(product_name, department_name, price, stock)
values ("microwave oven", "appliances", 85, 35);
insert into products(product_name, department_name, price, stock)
values ("playstation 4", "gaming", 385, 7);
insert into products(product_name, department_name, price, stock)
values ("tansmission fluids", "automotive and parts", 85, 100);
insert into products(product_name, department_name, price, stock)
values ("cat food", "pet supply", 25, 8);

alter table products
add column product_sale float (50,2) default 0;

select * from products;

CREATE TABLE departments(
department_id integer(20) not null auto_increment unique,
department_name varchar(50) not null,
over_head_costs float(20,2) not null,
primary key(department_id)
);

insert into departments(department_name, over_head_costs)
values ("kitchen and dinning", 500.22);
insert into departments(department_name, over_head_costs)
values ("electronics", 359.6);
insert into departments(department_name, over_head_costs)
values ("luggage and travel gear", 65.1);
insert into departments(department_name, over_head_costs)
values ("beuaty and personal care", 41.22);

select products.item_id, products.product_name, departments.department_name, departments.over_head_costs, products.product_sale from products, departments
where products.department_name = departments.department_name;

select * from departments
where departments.department_name = 'electronics';