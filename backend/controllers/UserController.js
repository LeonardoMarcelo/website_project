import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Coon} from '../models/DataBase.js';


export class User {
  static async index(req, res) {
    const {id_user} = req.body;
    const user = await Coon.getByParam('user','id', id_user);
    res.status(200).json({ data: user[0] });
  }
   static async get(req, res) {
    const id = req.params.id;

    const user = await Coon.getByParam('user','id', id);

    if (user.length == 0) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    res.status(200).json(user[0]);
  }
   static async getAll(req, res) {

    const users = await Coon.getAll('user');

    if (users.length == 0) {
      return res.status(404).json({ msg: "Usuários não encontrados!" });
    }

    res.status(200).json(users);
  }
}
