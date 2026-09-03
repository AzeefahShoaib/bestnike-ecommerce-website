const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Nike Backend Server is Running!");
});

// Get products from MySQL database
app.get("/api/products", (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch products"
            });
        }

        res.json(results);
    });
});
// Add product to cart
app.post("/api/cart", (req, res) => {
    const { product_id, quantity } = req.body;

    const sql = `
        INSERT INTO cart (product_id, quantity)
        VALUES (?, ?)
    `;

    db.query(sql, [product_id, quantity || 1], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to add product to cart"
            });
        }

        res.json({
            message: "Product added to cart successfully",
            cartId: result.insertId
        });
    });
});
// Get all cart items from database
app.get("/api/cart", (req, res) => {

    const sql = `
        SELECT 
            cart.id AS cart_id,
            products.id AS product_id,
            products.name,
            products.price,
            products.image,
            cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load cart"
            });
        }

        res.json(results);
    });
});
// Remove item from cart
app.delete("/api/cart/:id", (req, res) => {

    const cartId = req.params.id;

    const sql = "DELETE FROM cart WHERE id = ?";

    db.query(sql, [cartId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to remove item from cart"
            });
        }

        res.json({
            message: "Item removed from cart successfully"
        });
    });
});
// Add product to wishlist
app.post("/api/wishlist", (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({
            message: "Product ID is required"
        });
    }

    const sql = "INSERT INTO wishlist (product_id) VALUES (?)";

    db.query(sql, [product_id], (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to add product to wishlist"
            });
        }

        res.json({
            message: "Product added to wishlist successfully",
            wishlistId: result.insertId
        });
    });
});
// Remove product from wishlist
app.delete("/api/wishlist/:productId", (req, res) => {

    const productId = req.params.productId;

    const sql = "DELETE FROM wishlist WHERE product_id = ?";

    db.query(sql, [productId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to remove product from wishlist"
            });
        }

        res.json({
            message: "Product removed from wishlist successfully"
        });
    });
});
// Get wishlist items
app.get("/api/wishlist", (req, res) => {

    const sql = `
        SELECT
            wishlist.id AS wishlist_id,
            products.id AS product_id,
            products.name,
            products.price,
            products.image
        FROM wishlist
        JOIN products ON wishlist.product_id = products.id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load wishlist"
            });
        }

        res.json(results);
    });
});
// ===============================
// CHECKOUT / CREATE ORDER
// ===============================

app.post("/api/checkout", (req, res) => {
console.log("Checkout API called");
    const getCartSql = `
        SELECT 
            cart.product_id,
            cart.quantity,
            products.price
        FROM cart
        JOIN products ON cart.product_id = products.id
    `;

    db.query(getCartSql, (err, cartItems) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to read cart"
            });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        cartItems.forEach(item => {
            totalAmount += parseFloat(item.price) * item.quantity;
        });

        const createOrderSql = `
            INSERT INTO orders (total_amount, status)
            VALUES (?, 'Pending')
        `;

        db.query(createOrderSql, [totalAmount], (err, orderResult) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to create order"
                });
            }

            const orderId = orderResult.insertId;

            const orderValues = cartItems.map(item => [
                orderId,
                item.product_id,
                item.quantity
            ]);

            const orderItemsSql = `
                INSERT INTO order_items
                (order_id, product_id, quantity)
                VALUES ?
            `;

            db.query(orderItemsSql, [orderValues], (err) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Failed to save order items"
                    });
                }

                db.query("DELETE FROM cart", (err) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: "Order created but cart could not be cleared"
                        });
                    }

                    res.json({
                        message: "Order placed successfully!",
                        orderId: orderId,
                        total: totalAmount.toFixed(2)
                    });
                });
            });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});