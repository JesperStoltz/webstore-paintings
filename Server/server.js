const express = require('express');
const server = express();
server.use(express.json());
const port = 5000;
let Datastore = require('nedb');

/* Upload images */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

server.get("/", express.static(path.join(__dirname, "./public")));
const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/public"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

server.post("/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    console.log(req.body)
/*     const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../src/images/uploads/image.png");
    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);
        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    } */
  }
);

/* End of Upload images */

/* ============================================================================================================================
======================================================DATA BASES===============================================================
===============================================================================================================================*/
const userDB = new Datastore({ filename: './users.db', inMemoryOnly: false, autoload: true });
const productsDB = new Datastore({ filename: './products.db', inMemoryOnly: false, autoload: true });
const ordersDB = new Datastore({ filename: './orders.db', inMemoryOnly: false, autoload: true });
/* ============================================================================================================================
=================================================CORS SOLUTIONS - ALLOW CORS===================================================
===============================================================================================================================*/
server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//CREATE USER
server.post('/register', async (req, res) => {
  if (!req.body.name && !req.body.password) {
    res.status('406').end('No username and no password');
  }
  else if (!req.body.name && req.body.password) {
    res.status('406').end('No username');
  }
  else if (req.body.name && !req.body.password) {
    res.status('406').end('No password');
  }
  else {
    let userObj = {
      name: req.body.name,
      password: req.body.password,
      date: req.body.date
    }

    await new Promise((resolve, reject) => {
      userDB.find({ name: req.body.name }, function (err, username) {
        if (username.length > 0) {
          res.status('409').send("Username already exists");
        }
        else if (username.length === 0 || err) {
          userDB.insert(userObj, (err, newUser) => {
            if (err) {
              console.log(err), reject(err)
              res.status('204').end('The server received the information but could not create the user. This is most likely a database error:' + err)
            }
            else if (newUser) {
              res.status('201').end("User was created!");
              resolve(newUser)
            }
          }); //end of userDB.insert
        }
      }) //End of userDB.find
    }); //end of Promise
  }
});

//CHECK LOGIN FOR ADMIN
server.post('/loginuser', async (req, res) => {
  if (!req.body.name && !req.body.password) {
    res.status('406').end('No username and no password');
  }
  else if (!req.body.name && req.body.password) {
    res.status('406').end('No username');
  }
  else if (req.body.name && !req.body.password) {
    res.status('406').end('No password');
  }
  else {
    await new Promise((resolve, reject) => {
      userDB.find({ name: req.body.name, password: req.body.password }, function (err, user) {
        if (user.length === 0 || err) {
          res.status('404').end("Username doesn't exist.");
          reject(err);
        }
        else if (user.length > 0) {
                userDB.update({ _id: user[0]._id, }, {
                  name: user[0].name,
                  password: user[0].password,
                  date: new Date().toString(),
                  lastLoggedIn: user[0].date,
                }, (err, newAdminInfo) => {
                  if (err) {
                    console.log(err)
                    res.status('204').end('The server received the information but could not register the edited product. This is most likely a database error:')
                  }
                  else if (newAdminInfo) {
                    res.status('200').send({ name: user[0].name, date: user[0].date, lastLoggedIn:user[0].lastLoggedIn, _id: user[0]._id }).end('User found');
                  }
                });

          resolve(user);
        }
      })//End of find name
    }); //end of Promise
  }
});

//ADD NEW PRODUCT
server.post('/addproduct', async (req, res) => {
  if (!req.body ||
    !req.body.product ||
    !req.body.product.type ||
    !req.body.product.title ||
    !req.body.product.tags ||
    !req.body.product.description ||
    !req.body.product.price) {
    res.status('400').end('Post does not contain all nessecary data');
  }
  else {
    await new Promise((resolve, reject) => {
      productsDB.insert(req.body.product, (err, newProduct) => {
        if (err) {
          console.log(err), reject(err)
          res.status('204').end('The server received the information but could not create the recipe. This is most likely a database error:' + err)
        }
        else if (newProduct) {
          res.status('201').send(newProduct)
          resolve(newProduct)
        }
      }); //end of productDB.insert
    }); //End of Promise
  }
});

//GET ALL PRODUCTS
server.get('/getproducts', async (req, res) => {
  let search = "";
  if (req.query.search) {
    search = req.query.search;
  }

  let products = await new Promise((resolve, reject) => {
    productsDB.find({ type: "product" }, function (err, database) {
      if (err) {
        res.status('404').end('Couldnt find any products');
        reject(err);
      }
      else if (database) {
        resolve(database);
      }
    }) //end of recipesDB.find
  })  //end of Promise

  /* let filteredProducts; */
  let filteredProducts = [];

  if (search) {
    let splitSearch = search.split(" ");
    console.log(splitSearch);
    for (let search of splitSearch) {
      const mappedProducts = products.map(product => {
        if (product.title.toLowerCase().includes(search.toLowerCase())) {
          filteredProducts.push(product);
        }
        else if (product.description.toLowerCase().includes(search.toLowerCase())) {
          filteredProducts.push(product);
        }
        else {
          for (let tag of product.tags) {
            if (tag.toLowerCase().includes(search.toLowerCase())) {
              filteredProducts.push(product);
              break;
            }
          }
        }
      })
    }
  }

  if (search) {
    res.status('200').send(JSON.stringify(filteredProducts)).end('Products found');
  }
  else {
    res.status('200').send(JSON.stringify(products)).end('Products found');
  }
});

//GET LIST OF NAMES AND ID OF PRODUCTS
server.get('/getproductlist', async (req, res) => {

  let products = await new Promise((resolve, reject) => {
    productsDB.find({ type: "product" }, function (err, database) { //Den leter efter type: product. Kan lösa detta genom att ändra Add.
      if (err) {
        res.status('404').end('Couldnt find any products');
        reject(err);
      }
      else if (database) {
        resolve(database);
      }
    }) //end of recipesDB.find
  })  //end of Promise

  let listOfProducts = products.map(product => {
    return { title: product.title, _id: product._id };
  })

  res.status('200').send(JSON.stringify(listOfProducts)).end('Productlist found.');

});

// GET ONE PRODUCT
server.get('/getproduct/:id', async (req, res) => {
  let product = await new Promise((resolve, reject) => {
    productsDB.find({ _id: req.params.id }, function (err, product) {
      if (err) {
        res.status('404').end('Couldnt find any product');
        reject(err);
      }
      else if (product) {
        resolve(product);
      }
    }) //end of productsDB.find
  })  //end of Promise
  res.status('200').send(JSON.stringify(product)).end('product found');
});

//ADD EDITED PRODUCT
server.post('/product/:id', async (req, res) => {
  if (!req.body.product) {
    res.status('400').end('Post does not contain all nessecary data');
  }
  else {
    await new Promise((resolve, reject) => {
      productsDB.update({ _id: req.params.id, }, {
        type: req.body.product.type,
        title: req.body.product.title,
        description: req.body.product.description,
        amount: req.body.product.amount,
        tags: req.body.product.tags,
        reviews: req.body.product.reviews,
        price: req.body.product.price,

      }, (err, editedProduct) => {
        if (err) {
          console.log(err), reject(err)
          res.status('204').end('The server received the information but could not register the edited product. This is most likely a database error:')
        }
        else if (editedProduct) {
          res.status('201').end('The edited product was set!');
          resolve(editedProduct)
        }
      }); //end of userDB.insert

    }); //End of Promise  
  }
});

//GET ALL ORDERS
server.get('/getorders', async (req, res) => {
  let orders = await new Promise((resolve, reject) => {
    ordersDB.find({ type: "order" }, function (err, database) {
      if (err) {
        res.status('404').end('Couldnt find any orders');
        reject(err);
      }
      else if (database) {
        resolve(database);
      }
    }) //end of recipesDB.find
  })  //end of Promise

  res.status('200').send(JSON.stringify(orders)).end('Orders found');
});

//GET SPECIFIC ORDER
server.get('/getorder/:id', async (req, res) => {
  let order = await new Promise((resolve, reject) => {
    ordersDB.find({ _id: req.params.id }, function (err, order) {
      if (err) {
        res.status('404').end('Couldnt find any order');
        reject(err);
      }
      else if (order) {
        resolve(order);
      }
    }) //end of productsDB.find
  })  //end of Promise
  res.status('200').send(JSON.stringify(order)).end('Order found');
});

//ADD NEW ORDER
server.post('/addorder', async (req, res) => {
  if (!req.body ||
    !req.body.order ||
    !req.body.order.type ||
    !req.body.order.cart || //Array of obj
    !req.body.order.customer || //Object
    !req.body.order.payment) { //Object
    res.status('400').end('Post does not contain all nessecary data');
  }
  else {
    await new Promise((resolve, reject) => {
      ordersDB.insert(req.body.order, (err, newOrder) => {
        if (err) {
          console.log(err), reject(err)
          res.status('204').end('The server received the information but could not create the order. This is most likely a database error:' + err)
        }
        else if (newOrder) {
          res.status('201').send(newOrder)
          resolve(newOrder)
        }
      }); //end of ordersDB.insert
    }); //End of Promise
  }
});

//ADD EDITED ORDERS
server.post('/editorder/:id', async (req, res) => {
  if (!req.body.order) {
    res.status('400').end('Post does not contain all nessecary data');
  }
  else {
    await new Promise((resolve, reject) => {
      ordersDB.update({ _id: req.params.id, }, {
        type: req.body.order.type,
        date: req.body.order.date,
        cart: req.body.order.cart,
        customer: req.body.order.customer,
        payment: req.body.order.payment,
        handled: req.body.order.handled,
      }, (err, editedOrder) => {
        if (err) {
          console.log(err), reject(err)
          res.status('204').end('The server received the information but could not register the edited product. This is most likely a database error:')
        }
        else if (editedOrder) {
          res.status('201').end('The edited product was set!');
          resolve(editedOrder)
        }
      }); //end of userDB.insert

    }); //End of Promise  
  }
});

server.listen(port, () =>
  console.log(`Server listening on port ${port}!`)
);
