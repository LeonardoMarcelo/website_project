import mysql from 'mysql2/promise';

export class Coon {
  static connection;

  static async connect() {
    if (!Coon.connection) {
      Coon.connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'project_programacao',
      });
      console.log('📡 Conectado ao MySQL');
    }
    return Coon.connection;
  }

  static async getByParam(table,param, value) {
    await Coon.connect(); 
    const [rows] = await Coon.connection.query(
      `SELECT * FROM ${table} WHERE \`${param}\` = ?`,
      [value]
    );
    return rows;
  }
  static async getAll(name) {
    await Coon.connect(); 
    const [rows] = await Coon.connection.query(
      `SELECT * FROM ${name} `
    );
    return rows;
  }
  static async create(table, data) {
    await Coon.connect();

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    try {
      const [result] = await Coon.connection.execute(sql, values);
      return { status: 201, data: result.insertId };
    } catch (error) {
      return { status: 500, data: 'Error inserting data!' };
    }
  }
  static async update(table, id, data) {
    await Coon.connect();

    const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);

    const sql = `UPDATE ${table} SET ${columns} WHERE id = ?`;

    try {
      const [result] = await Coon.connection.execute(sql, [...values, id]);
      return { status: 200, data: result.affectedRows };
    } catch (error) {
      console.error(error);
      return { status: 500, data: 'Error updating data!' };
    }
  }

  
}
//casos de uso
// await Model.update('products', 7, {
//   name: 'Updated Product Name',
//   price: 1999.99
// });
// await Model.create('users', {
//   name: 'Leo',
//   email: 'leo@example.com',
//   password: '123456'
// });
