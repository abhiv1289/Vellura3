import Task from "../Models/task.js";
import User from "../Models/User.js";
import cron from "node-cron";

export const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const existingTask = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existingTask)
      return res.status(404).json({ message: "Task not found" });

    const isNewlyCompleted =
      req.body.status === "completed" && existingTask.status !== "completed";

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    let updatedUser = null;

    if (isNewlyCompleted) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { exp: 10 } },
        { new: true }
      );
    }

    res.status(200).json({
      task: updatedTask,
      exp: updatedUser ? updatedUser.exp : undefined,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignDailyTask = async () => {
  try {
    const users = await User.find(); // Fetch all users
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date without time

    const taskPool = [
      { title: "Daily Meditation", description: "Meditate for 5 mins" },
      {
        title: "Gratitude Journal",
        description: "Write 3 things you're grateful for",
      },
      { title: "Walk Break", description: "Go for a 10-minute walk" },
      {
        title: "Breathing Exercise",
        description: "Do 5 minutes of deep breathing",
      },
      { title: "Hydration Reminder", description: "Drink 2 glasses of water" },
    ];

    for (const user of users) {
      // Check if today's task already exists for this user
      const existingTask = await Task.findOne({
        user: user._id,
        date: today,
      });

      if (existingTask) {
        // If task exists, reset status to "pending"
        existingTask.status = "pending";
        await existingTask.save();
      } else {
        // Pick a random task
        const randomTask =
          taskPool[Math.floor(Math.random() * taskPool.length)];

        await Task.create({
          title: randomTask.title,
          description: randomTask.description,
          user: user._id,
          status: "pending",
          date: today,
        });
      }
    }
    // console.log("Daily tasks assigned (if not already present)");
  } catch (error) {
    console.error("Error assigning daily task:", error.message);
  }
};

// Schedule the task to run every day at midnight (00:00)
cron.schedule("0 0 * * *", assignDailyTask, {
  scheduled: true,
  timezone: "UTC",
});
