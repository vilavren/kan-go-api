import SectionModel from '../models/Section.js'
import TaskModel from '../models/Task.js'

export const create = async (req, res) => {
  const sectionId = req.params.sectionId

  try {
    const section = await SectionModel.findById(sectionId)
    const tasksCount = await TaskModel.find({ section: sectionId }).count()
    const task = await TaskModel.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0,
    })
    task._doc.section = section
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const update = async (req, res) => {
  const taskId = req.params.taskId

  try {
    const task = await TaskModel.findByIdAndUpdate(taskId, { $set: req.body })
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json(error)
  }
}
