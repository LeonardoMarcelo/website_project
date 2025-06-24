import jwt from "jsonwebtoken";
export default function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });
    // Decodifica o token para acessar o payload (incluindo o id)
   
    try {
      // const secret = process.env.SECRET;
      const secret = 'TOMOCREATINAPARACAVALO';
      jwt.verify(token, secret);  
      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
  }
  