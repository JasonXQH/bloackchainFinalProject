
import parking from "./index.json"

export const getAllParkings = () => {

  return {
    data: parking,
    courseMap: parking.reduce((a, c, i) => {
      a[c.id] = c
      a[c.id].index = i
      return a
    }, {})
  }
}