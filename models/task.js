const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    allocatedTo: {
        type: String,
        required: true
    },
    validity: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'in progress'], // You can define the possible values for status
        default: 'pending' // Default status when a new task is created
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
