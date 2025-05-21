import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Coon} from '../models/DataBase.js';


export class Categories {
    static async index(req, res) {
        try {
        const categories = await Coon.getAll('categories');
        return res.status(200).json(categories);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao listar categorias' });
        }
    }
    static async register(req, res) {
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório e deve ter pelo menos 3 caracteres' });
        }

        try {
        const existing = await Coon.getByParam('categories', 'name', name);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Categoria já existe' });
        }

        const result = await Coon.create('categories', { name });
        return res.status(result.status).json({
            message: 'Categoria criada com sucesso',
            id: result.data
        });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar categoria' });
        }
    }
    static async update(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório e deve ter pelo menos 3 caracteres' });
        }

        try {
        const category = await Coon.getByParam('categories', 'id', id);
        if (category.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        const result = await Coon.update('categories', id, { name });
        return res.status(result.status).json({
            message: 'Categoria atualizada com sucesso'
        });
        } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar categoria' });
        }
    }

    static async getAll(req, res) {

        const users = await Coon.getAll('categories');

        if (users.length == 0) {
        return res.status(404).json({ msg: "Usuários não encontrados!" });
        }

        res.status(200).json(users);
    }
}
