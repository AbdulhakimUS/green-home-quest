// Конфигурация наград и сложности игры

// Множитель сложности для миссий (1 = обычная, 2 = сложная, 3 = очень сложная)
export const DIFFICULTY_MULTIPLIER = 1;

// Награда за нахождение всех 4 кладов
export const ALL_TREASURES_BONUS = 20000;

// Пороги и награды за количество предметов
export const ITEM_COUNT_REWARDS = [
  { threshold: 50, reward: 5000 },
  { threshold: 75, reward: 10000 },
  { threshold: 100, reward: 25000 },
];

// Базовые цели миссий (будут умножаться на DIFFICULTY_MULTIPLIER)
export const BASE_MISSION_TARGETS = {
  house_5: 5,
  house_10: 10,
  house_15: 15,
  house_20: 20,
  max_level: 25,
  money_50k: 50000,
  money_200k: 200000,
  items_10: 10,
  oxygen_50: 50,
};
