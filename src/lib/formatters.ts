/**
 * Форматирует число с одним знаком после запятой (русская локаль с запятой)
 * Если дробная часть 0, показывает целое число
 */
export const formatLevel = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  const str = rounded.toFixed(1);
  // Если заканчивается на .0, убираем дробную часть
  if (str.endsWith('.0')) {
    return str.slice(0, -2);
  }
  // Заменяем точку на запятую (русский формат)
  return str.replace('.', ',');
};

/**
 * Форматирует деньги без знаков после запятой
 */
export const formatMoney = (value: number): string => {
  return Math.round(value).toLocaleString('ru-RU');
};
