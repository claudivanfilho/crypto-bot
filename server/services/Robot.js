export default {
  doActionToEach: async (args, colection, conditionsAction) => {
    for (let i = 0; i < colection.length; i++) {
      const item = colection[i]
      for (let j = 0; j < conditionsAction.length; j++) {
        const conditions = conditionsAction[0]
        const action = conditionsAction[1]
        const breakIfCatched = conditionsAction[2]
        let canDoAction = true
        for (let k = 0; k < conditions.length; k++) {
          const conditionResult = await conditions[k]({ args, item })
          if (!conditionResult) {
            canDoAction = false
            break
          }
        }
        if (canDoAction) {
          try {
            await action({ args, item })
          } catch (err) {
            console.log('something wrong happen on doActiontoEach: ', err.message)
          }
          if (breakIfCatched) {
            return
          }
        }
      }
    }
  },
}
