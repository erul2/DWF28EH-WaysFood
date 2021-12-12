// import models
const { transactions, orders, products, user } = require("../../models");
const moment = require("moment");
// controller

// get transactions by seller id
exports.getTransactions = async (req, res) => {
  try {
    const transactionsData = await transactions.findAll({
      where: { idSeller: req.params.userId },
      order: [["id", "DESC"]],
      include: [
        {
          model: user,
          as: "buyer",
          attributes: ["fullName"],
        },
        {
          model: products,
          through: {
            model: orders,
            attributes: ["qty"],
          },
          attributes: ["id", "title", "price", "image"],
        },
      ],
      attributes: {
        exclude: ["updatedAt", "idBuyer", "idSeller"],
      },
    });

    const data = transactionsData.map((trx) => {
      const a = moment(new Date(trx.createdAt));
      const b = a.format("dddd");
      const c = a.format("D MMM YY");

      return {
        id: trx.id,
        userOrder: trx.buyer.fullName,
        status: trx.status,
        address: trx.address,
        total: trx.total,
        date: {
          day: b,
          date: c,
        },
        order: trx.products.map((order) => {
          const { id, title, price, image } = order;
          return {
            id,
            title,
            price,
            image: process.env.UPLOADS + image,
            qty: order.orders.qty,
          };
        }),
      };
    });

    res.send({
      status: "success",
      data: {
        transactions: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", message: "Server Error" });
  }
};

// get detail transaction
exports.getDetailTransaction = async (req, res) => {
  try {
    const transactionsData = await transactions.findOne({
      where: { id: req.params.transactionId },
      include: [
        {
          model: user,
          as: "buyer",
          attributes: ["id", "fullName", "email", "location"],
        },
        {
          model: user,
          as: "seller",
          attributes: ["id", "fullName", "email", "location"],
        },
        {
          model: products,
          through: {
            model: orders,
            attributes: ["qty"],
          },
          attributes: ["id", "title", "price", "image"],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idBuyer", "idSeller"],
      },
    });

    const data = {
      id: transactionsData.id,
      total: transactionsData.total,
      address: transactionsData.address,
      userOrder: transactionsData.buyer,
      seller: transactionsData.seller,
      status: transactionsData.status,
      order: transactionsData.products.map((order) => {
        const { id, title, price, image } = order;
        return {
          id,
          title,
          price,
          image: process.env.UPLOADS + image,
          qty: order.orders.qty,
        };
      }),
    };

    res.send({
      status: "success",
      data: {
        transactions: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", message: "Server Error" });
  }
};

// add transaction
exports.addTransaction = async (req, res) => {
  const deliveryAddress = req.body.address;
  const newOrders = req.body.products;
  const restoId = req.body.resto;
  let subtotal = 0;

  try {
    // get seller id from product that user buy
    const seller = await user.findOne({
      where: { id: restoId },
      attributes: ["id", "fullName", "location"],
    });

    // get buyer detail
    const userOrder = await user.findOne({
      where: { id: req.user.id },
      attributes: ["id", "fullName", "location", "email"],
    });

    // get product detail to count subtotal
    const productsId = newOrders.map((order) => order.id);
    const productsData = await products.findAll({
      where: {
        id: productsId,
      },
    });

    const ordersData = productsData.map((product) => {
      let qty = 1;
      newOrders.map((order) => {
        if (order.id === product.id) {
          subtotal += product.price * order.qty;
          qty = order.qty;
        }
      });

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: process.env.UPLOADS + products.image,
        qty,
      };
    });

    const tmpAddress = {
      deliveryAddress: deliveryAddress ? deliveryAddress : userOrder.location,
      restoAddress: seller.location,
    };

    const transactionData = {
      total: subtotal + 10000,
      address: JSON.stringify(tmpAddress),
      idBuyer: req.user.id,
      idSeller: restoId,
      status: "Waiting approve",
    };

    const transaction = await transactions.create(transactionData);

    const dataNewOrders = await newOrders.map((order) => {
      return {
        qty: order.qty,
        idProduct: order.id,
        idTransaction: transaction.id,
      };
    });

    await orders.bulkCreate(dataNewOrders);

    // const order = await orders.findAll({
    //   where: { idTransaction: transaction.id },
    //   include: [
    //     {
    //       model: products,
    //       attributes: ["id", "title", "price", "image"],
    //     },
    //   ],
    //   attributes: ["qty"],
    // });

    // const data = order.map((order) => {
    //   const { id, title, price, image } = order.product;
    //   return {
    //     id,
    //     title,
    //     price,
    //     image: process.env.UPLOADS + image,
    //     qty: order.qty,
    //   };
    // });

    res.send({
      status: "success",
      data: {
        transaction: {
          id: transaction.id,
          userOrder: userOrder,
          status: transaction.status,
          order: ordersData,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", message: "Server Error" });
  }
};

// edit transaction
exports.editTransaction = async (req, res) => {
  try {
    const status = req.body.status;

    const transaction = await transactions.findOne({
      where: { id: req.params.transactionId },
      include: [
        {
          model: user,
          as: "buyer",
          attributes: ["id", "fullName", "location", "email"],
        },
        {
          model: products,
          through: {
            model: orders,
            attributes: ["qty"],
          },
          attributes: ["id", "title", "price"],
        },
      ],
      attributes: ["id", "status"],
    });

    await transaction.update({ status: status });

    const order = transaction.products.map((order) => {
      return {
        id: order.id,
        title: order.title,
        price: order.price,
        image: process.env.UPLOADS + order.image,
        qty: order.orders.qty,
      };
    });

    res.send({
      status: "success",
      data: {
        transaction,
        transaction: {
          id: transaction.id,
          userOrder: transaction.buyer,
          status: transaction.status,
          order,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", message: "Server Error" });
  }
};

// delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transactionData = await transactions.findOne({
      where: { id: req.params.transactionId },
    });

    if (!transactionData) {
      return res.status(404).send({
        status: "failed",
        message: "Product not found",
      });
    }

    transactionData.destroy();

    res.send({
      status: "success",
      data: {
        id: req.params.transactionId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", message: "Server Error" });
  }
};

// get user ransactions
exports.getUserTransactions = async (req, res) => {
  try {
    const transactionData = await transactions.findAll({
      where: { idBuyer: req.user.id },
      order: [["id", "DESC"]],
      include: [
        {
          model: products,
          through: {
            model: orders,
            attributes: ["qty"],
          },
          attributes: ["id", "title", "price", "image"],
        },
        {
          model: user,
          as: "seller",
          attributes: ["fullName"],
        },
      ],
      attributes: ["id", "status", "address", "total", "createdAt"],
    });

    const data = transactionData.map((trx) => {
      const a = moment(new Date(trx.createdAt));
      const b = a.format("dddd");
      const c = a.format("D MMM YY");

      return {
        id: trx.id,
        status: trx.status,
        total: trx.total,
        resto: trx.seller.fullName,
        address: trx.address,
        date: {
          day: b,
          date: c,
        },
        order: trx.products.map((product) => {
          const { id, title, price, image } = product;
          return {
            id,
            title,
            price,
            image: process.env.UPLOADS + image,
            qty: product.orders.qty,
          };
        }),
      };
    });
    res.send({
      status: "success",
      data: {
        transactions: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", message: "Server Error" });
  }
};
