import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Coon} from '../models/DataBase.js';


export class AuthController {
  static async index(req, res) {
  
    res.status(200).json({ msg: "Bem vindo a API!" });
  }
  static async register(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }

    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    if (password != confirmpassword) {
      return res
        .status(422)
        .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }

    // check if user exists
    const userExists = await Coon.getByParam('email',email);

    if (userExists.length > 0) {
      return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = await Coon.create('user',{
      "name":name,
      "email":email,
      "password":passwordHash,
    });

    try {
      if (user.status == 201){
        return res.status(201).json({ msg: "Usuário criado com sucesso! identificação: " + user.data });
      }else{
        return res.status(422).json({ msg: "Usuário não cadastrado!" });

      }
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    
    // validations
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    // check if user exists
    const user = await Coon.getByParam('user', 'email', email );
    console.log(user)
    if (user.length == 0) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
    

    // check if password match
    const checkPassword = await bcrypt.compare(password, user[0].password);

    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida" });
    }

    try {
      // const secret = process.env.SECRET;
      const secret = 'TOMOCREATINAPARACAVALO';
      const token = jwt.sign(
        {
          id: user[0].id
        },
        secret,
        { expiresIn: '600s' } // ou simplesmente 60

      );
      res
        .status(200)
        .json({ msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
      res.status(500).json({ msg: 'erro' });
    }
  }
}
