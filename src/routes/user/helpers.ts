export const findBestSequence = (listOfMeals: Array<any> = []) => {
  const listOfDietMealsProperty = listOfMeals
    .map((meal) => {
      return meal.is_part_of_diet ? '1' : '0'
    })
    .join('')
    .split('0')
  const dietMealsCount = listOfDietMealsProperty.map((sequence) => {
    return sequence.length
  })
  return dietMealsCount.sort((a, b) => b - a)[0]
}

export const countMeals = (
  listOfMeals: Array<any> = [],
  isDietMeal: boolean,
) => {
  return listOfMeals.filter(
    (meal) => meal.is_part_of_diet === (isDietMeal ? 1 : 0),
  ).length
}
