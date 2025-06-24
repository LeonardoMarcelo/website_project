import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Coon} from '../models/DataBase.js';
import nodemailer from 'nodemailer';

export class AuthController {
  static async index(req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const id_user = decoded.id;
    const user = await Coon.getByParam('user','id', id_user);
    const obj_retorno = {
      'name': user[0].name,
      'email': user[0].email,
      'id': user[0].id
    }
    res.status(200).json({ data: obj_retorno, msg: "Autenticação realizada com sucesso!" });
  }
  static async register(req, res) {
    const { name, email, password, confirm_password } = req.body;

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

    if (password != confirm_password) {
      return res
        .status(422)
        .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }

    // check if user exists
    const userExists = await Coon.getByParam('user','email', email);

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

 static async reset(req, res) {
    const { email, password, confirm_password, code } = req.body;
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
    if (password != confirm_password) {
      return res
        .status(422)
        .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }
    
    const user = await Coon.
    getByParam('user', 'email', email);
    if (user.length === 0) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
    if (user[0].code !== code) {
      return res.status(400).json({ msg: "Código inválido!" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const updateUser = await Coon.update('user',  user[0].id, {
      'password': passwordHash
    });
    if (updateUser.status == 200){
      return res.status(200).json({ msg: "Senha alterada com sucesso!" });
    }else{
      return res.status(422).json({ msg: "Senha não alterada!" });
    }
 }
 static async getCode(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }

    const user = await Coon.getByParam('user', 'email', email);
    if (user.length === 0) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
    const generateCode = () => Math.floor(100000 + Math.random() * 900000);
    
    const code = generateCode();
    
    const updateUser = await Coon.update('user',  user[0].id, {
      'code': code
    });

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: 'e0fa5bcf87a2cc',
        pass: '995ef7c6071820',
      }
    });

    let mailOptions = {
      from: '"Sua Empresa" Project Programação',
      to: email,
      subject: 'Seu código de verificação',
      text: `Olá! Seu código de verificação é: ${code}`,
      html: `<p>Olá!</p><p>Seu código de verificação é: <strong>${code}</strong></p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.json({ msg: "Código enviado para o email com sucesso." });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return res.status(500).json({ msg: "Erro ao enviar o código por email." });
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
