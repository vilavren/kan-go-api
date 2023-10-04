import BoardModel from '../models/Board.js'

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
    const boards = await BoardModel.find({ user: req.user._id }).sort(
      '-position'
    )
    res.status(200).json(boards)
  } catch (error) {
    res.status(500).json(error)
  }
}
