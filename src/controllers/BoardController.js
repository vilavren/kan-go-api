import BoardModel from '../models/Board.js'

export const create = async () => {
  try {
    const boardsCount = await BoardModel.find().count()
    const board = await new BoardModel({
      user: req.user._id,
      position: boardsCount > 0 ? boardsCount : 0,
    })
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
