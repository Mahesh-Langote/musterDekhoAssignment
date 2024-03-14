const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.use(express.json()); 

router.post("/", async (req, res) => {
    try {
         const newTask = new Task({
            taskName: req.body.taskName,
            taskDescription: req.body.taskDescription,
            allocatedTo: req.body.allocatedTo,
            validity: req.body.validity,
            status: req.body.status  
        }); 

        const savedTask = await newTask.save();
 
        res.status(201).json({ message: "Task submitted successfully", task: savedTask });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
});
router.get('/alltasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/",  async (req, res) => {
   try {
        const userEmail = req.query.email; // Assuming the email is passed as a query parameter
        const tasks = await Task.find({ allocatedTo: userEmail });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id",  async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the task by ID
        const task = await Task.findById(id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update task status
        task.status = status;

        // Save updated task
        await task.save();

        res.json({ message: "Task status updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id; 
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) { 
            return res.status(404).json({ message: 'Task not found' });
        }
        // If deletion successful, return 200 OK with success message
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        // If an error occurs, return 500 Internal Server Error with error message
        console.error("Error deleting task:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.put('/update/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const updatedTask = req.body;

        // Find the task by ID and update its details
        const task = await Task.findByIdAndUpdate(taskId, updatedTask, { new: true });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
