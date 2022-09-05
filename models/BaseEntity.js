const dbConnection = await dbConfig();

class BaseEntity {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    findAll(table) {
     this.dbConnection.query(`SELECT * FROM ??`, [table]);
    }

    findById(column, table, id) {
        this.dbConnection.query(`SELECT * FROM ?? WHERE id = ?`, [column, table, id]);
    }

    create(obj) {

    }
    updateById(id) {

    }

    deleteById(id) {

    }
}