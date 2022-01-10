let todoModel = require("../models/todo");


let findAll = async function(query) {
    let todos = await todoModel.find(query);
    return todos;
};

module.exports = {
    findAll
}