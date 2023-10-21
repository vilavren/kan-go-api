import SectionModel from '../models/Section.js'
import TaskModel from '../models/Task.js'

export const create = async (req, res) => {
  const { sectionId } = req.body

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
  const { taskId } = req.params

  try {
    const task = await TaskModel.findByIdAndUpdate(taskId, { $set: req.body })
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const remove = async (req, res) => {
  const { taskId } = req.params

  try {
    const currentTask = await TaskModel.findById(taskId)
    await TaskModel.deleteOne({ _id: taskId })
    const tasks = await TaskModel.find({ section: currentTask.section })

    for (const key in tasks) {
      await TaskModel.findByIdAndUpdate(tasks[key].id, {
        $set: { position: key },
      })
    }

    res.status(200).json('deleted')
  } catch (error) {
    res.status(500).json(error)
  }
}

export const updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body

  const resourceListReverse = resourceList.reverse()
  const destinationListReverse = destinationList.reverse()
  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceListReverse) {
        await TaskModel.findByIdAndUpdate(resourceListReverse[key].id, {
          $set: {
            section: resourceSectionId,
            position: key,
          },
        })
      }
    }
    for (const key in destinationListReverse) {
      await TaskModel.findByIdAndUpdate(destinationListReverse[key].id, {
        $set: {
          section: destinationSectionId,
          position: key,
        },
      })
    }
    res.status(200).json('updated')
  } catch (error) {
    res.status(500).json(error)
  }
}
