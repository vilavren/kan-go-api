import BoardModel from '../models/Board.js'
import SectionModel from '../models/Section.js'
import TaskModel from '../models/Task.js'

export const create = async (req, res) => {
  try {
    const boardsCount = await BoardModel.find().count()
    const doc = new BoardModel({
      user: req.userId,
      position: boardsCount > 0 ? boardsCount : 0,
    })
    const board = await doc.save()
    res.status(201).json(board)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getAll = async (req, res) => {
  try {
    const boards = await BoardModel.find({ user: req.userId }).sort('-position')
    res.status(200).json(boards)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const updatePosition = async (req, res) => {
  const boards = req.body
  try {
    for (const key in boards.reverse()) {
      const board = boards[key]
      await BoardModel.findByIdAndUpdate(board.id, { $set: { position: key } })
    }
    res.status(200).json('updated')
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getOne = async (req, res) => {
  const boardId = req.params.id

  try {
    const board = await BoardModel.findOne({ user: req.userId, _id: boardId })
    if (!board) return res.status(404).json('Не найдено')
    const sections = await SectionModel.find({ board: boardId })
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id })
        .populate('section')
        .sort('-position')
      section._doc.tasks = tasks
    }
    board._doc.sections = sections
    res.status(200).json(board)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const update = async (req, res) => {
  const boardId = req.params.id

  const { title, description, favorite } = req.body

  try {
    if (title === '') req.body.title = 'Без названия'
    if (description === '') req.body.description = 'Описание'

    const currentBoard = await BoardModel.findOne({
      user: req.userId,
      _id: boardId,
    })
    if (!currentBoard) return res.status(404).json('Не найдено')

    if (favorite !== undefined && currentBoard.favorite !== favorite) {
      const favorites = await BoardModel.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort('favoritePosition')
      if (favorite) {
        req.body.favoritePosition = favorites.length > 0 ? favorites.length : 0
      } else {
        for (const key in favorites) {
          const element = favorite[key]
          await BoardModel.findByIdAndUpdate(element.id, {
            $set: { favoritePosition: key },
          })
        }
      }
    }

    const board = await BoardModel.findByIdAndUpdate(boardId, {
      $set: req.body,
    })
    res.status(200).json(board)
  } catch (error) {
    res.status(500).json(error)
  }
}
