import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Coon} from '../models/DataBase.js';


export class Products {
    static async index(req, res) {
    
        res.status(200).json({ msg: "Bem vindo a API!" });
    }
    static async register(req, res) {
        const { name, description, price, category_id, image } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length < 3) {
            return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 3 caracteres.' });
        }

        if (!description || typeof description !== 'string' || description.trim().length < 10) {
            return res.status(400).json({ error: 'Descrição é obrigatória e deve ter pelo menos 10 caracteres.' });
        }

        if (!price || isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({ error: 'Preço inválido.' });
        }

        if (!category_id || isNaN(category_id)) {
            return res.status(400).json({ error: 'ID da categoria é obrigatório e deve ser numérico.' });
        }

        if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
         return res.status(400).json({ error: 'Imagem inválida. Deve estar em formato Base64 (data:image/...).' });
        }

        try {
            const category = await Coon.getByParam('categories', 'id', category_id);
            if (category.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada.' });
            }

            const productData = { name, description, price, category_id, image };
            const result = await Coon.create('products', productData);

            return res.status(result.status).json({
                id: result.data
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar produto.' });
        }
    }
    static async update(req, res) {
        const { id } = req.params;
        const { name, description, price, category_id, image } = req.body;

        if (name && (typeof name !== 'string' || name.trim().length < 3)) {
            return res.status(400).json({ error: 'Nome inválido.' });
        }

        if (description && (typeof description !== 'string' || description.trim().length < 10)) {
             return res.status(400).json({ error: 'Descrição inválida.' });
        }

        if (price && (isNaN(price) || Number(price) <= 0)) {
            return res.status(400).json({ error: 'Preço inválido.' });
        }

        if (category_id && isNaN(category_id)) {
            return res.status(400).json({ error: 'ID de categoria inválido.' });
        }

        if (image && (typeof image !== 'string' || !image.startsWith('data:image/'))) {
            return res.status(400).json({ error: 'Imagem inválida. Deve estar em formato Base64.' });
        }

        try {
            const product = await Coon.getByParam('products', 'id', id);
            if (product.length === 0) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            if (category_id) {
                const category = await Coon.getByParam('categories', 'id', category_id);
                if (category.length === 0) {
                return res.status(404).json({ error: 'Categoria não encontrada.' });
                }
            }

            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (description) updatedFields.description = description;
            if (price) updatedFields.price = price;
            if (category_id) updatedFields.category_id = category_id;
            if (image) updatedFields.image = image;

            const result = await Coon.update('products', id, updatedFields);

            return res.status(result.status).json({ message: 'Produto atualizado com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar produto.' });
        }
    }
    
    static async get(req, res) {
        const id = req.params.id;

        const user = await Coon.getByParam('products','id', id);

        if (user.length == 0) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        res.status(200).json(user[0]);
    }
    static async getAll(req, res) {

        const prods = await Coon.getAll('products');

        if (prods.length == 0) {
            return res.status(404).json({ msg: "Produtos não encontrados!" });
        }

        await Promise.all(prods.map(async (element) => {
            const category = await Coon.getByParam('categories', 'id', element.category_id);
            element.category = category.length > 0 ? category[0].name : null;
        }));

        console.log(prods)
        res.status(200).json(prods);
    }
}
