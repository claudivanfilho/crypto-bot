export default {
  doActionToEach,
}

export const doActionToEach = async (args, colection, conditionsAction) => {
  for (let i = 0; i < colection.length; i++) {
    const item = colection[i]
    for (let j = 0; j < conditionsAction.length; j++) {
      const conditions = conditionsAction[j].conditions
      const action = conditionsAction[j].action
      let breakIfCatched = conditionsAction[j].breakIfCatched
      let canDoAction = true
      for (let k = 0; k < conditions.length; k++) {
        try {
          const conditionResult = await conditions[k]({ args, item })
          if (!conditionResult) {
            canDoAction = false
            break
          }
        } catch (err) {
          console.log(`Something wrong happen in condition ${conditions[k].name}:`, err.message)
          canDoAction = false
          breakIfCatched = true
          break
        }
      }
      if (canDoAction) {
        try {
          await action({ args, item })
        } catch (err) {
          console.log(`Something wrong happen in action ${action.name}:`, err.message)
        }
        if (breakIfCatched) {
          return
        }
      }
    }
  }
}
