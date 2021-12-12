const { user, popular } = require("../../models");
const fs = require("fs");

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: { users },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// controller delete user by id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userExist = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "user not found",
      });
    }
    await user.destroy({
      where: { id },
    });

    res.send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// controller edit user
exports.editUser = async (req, res) => {
  try {
    const userData = await user.findOne({
      where: { id: req.user.id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    let image = "";
    // chek image updated or not
    if (req.file) {
      image = req.file.filename;
      // if image updated preform delte old image
      fs.unlink(`uploads/${userData.image}`, (err) => {
        err ? console.log(err) : null;
      });
    } else {
      image = userData.image;
    }

    await userData.update({
      ...req.body,
      image,
    });

    const data = {
      fullName: userData.fullName,
      phone: userData.phone,
      location: userData.location,
      image: process.env.UPLOADS + userData.image,
    };

    res.send({
      status: "success",
      data: {
        user: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// get all restos
exports.getRestos = async (req, res) => {
  try {
    const popularResto = await popular.findAll({
      attributes: ["idUser"],
    });
    const restos = await user.findAll({
      where: {
        role: "partner",
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    const dataResto = () => {
      let pop = [];
      let near = [];
      for (let i = 0; i < restos.length; i++) {
        let isPop = () => {
          for (let j = 0; j < popularResto.length; j++) {
            if (popularResto[j].idUser == restos[i].id) {
              return true;
            }
          }
          return false;
        };
        if (isPop()) {
          pop.push(restos[i]);
        } else {
          near.push(restos[i]);
        }
      }

      return {
        pop,
        near,
      };
    };

    const data = dataResto();
    res.send({
      status: "success",
      data: {
        pop: data.pop.map((resto) => {
          return {
            id: resto.id,
            fullName: resto.fullName,
            image: process.env.UPLOADS + resto.image,
            location: resto.location,
          };
        }),
        near: data.near.map((resto) => {
          return {
            id: resto.id,
            fullName: resto.fullName,
            image: process.env.UPLOADS + resto.image,
            location: resto.location,
          };
        }),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
