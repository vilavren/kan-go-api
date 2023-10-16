import SectionModel from '../models/Section.js'
import TaskModel from '../models/Task.js'

export const create = async (req, res) => {
  const boardId = req.params.boardId

  try {
    const section = await SectionModel.create({ board: boardId })
    section._doc.tasks = []
    res.status(201).json(section)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const update = async (req, res) => {
  const { sectionId } = req.params

  try {
    const section = await SectionModel.findByIdAndUpdate(sectionId, {
      $set: req.body,
    })
    section._doc.tasks = []
    res.status(200).json(section)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const remove = async (req, res) => {
  const { sectionId } = req.params

  try {
    await TaskModel.deleteMany({ section: sectionId })
    await SectionModel.deleteMany({ _id: sectionId })
    res.status(200).json('deleted')
  } catch (error) {
    res.status(500).json(error)
  }
}
