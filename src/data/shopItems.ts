import { ShopItem, CardType } from "@/types/game";

export const shopItems: Record<CardType, ShopItem[]> = {
  energy: [
    {
      id: "hamster",
      name: "Бегающий хомяк",
      category: "energy",
      tier: 1,
      level: 0,
      basePrice: 200,
      efficiency: 1,
      ecology: 3,
      description: "Милый хомяк, который бегает в колесе и вырабатывает минимум энергии"
    },
    {
      id: "hand-crank",
      name: "Ручной генератор",
      category: "energy",
      tier: 2,
      level: 0,
      basePrice: 500,
      efficiency: 2,
      ecology: 4,
      description: "Ручной генератор для выработки небольшого количества энергии"
    },
    {
      id: "bicycle",
      name: "Велосипедный генератор",
      category: "energy",
      tier: 3,
      level: 0,
      basePrice: 1000,
      efficiency: 4,
      ecology: 5,
      description: "Велосипед с генератором для выработки энергии при езде"
    },
    {
      id: "water-wheel",
      name: "Водяное колесо",
      category: "energy",
      tier: 4,
      level: 0,
      basePrice: 2000,
      efficiency: 6,
      ecology: 7,
      description: "Традиционное водяное колесо для выработки энергии из потока воды"
    },
    {
      id: "solar-panel",
      name: "Солнечная батарея",
      category: "energy",
      tier: 5,
      level: 0,
      basePrice: 3500,
      efficiency: 8,
      ecology: 9,
      description: "Современная солнечная панель для экологичного получения энергии"
    },
    {
      id: "wind-turbine",
      name: "Ветряная турбина",
      category: "energy",
      tier: 6,
      level: 0,
      basePrice: 5000,
      efficiency: 10,
      ecology: 10,
      description: "Мощная ветряная турбина - самый эффективный и экологичный источник энергии"
    }
  ],
  water: [
    {
      id: "bucket",
      name: "Ведро для дождя",
      category: "water",
      tier: 1,
      level: 0,
      basePrice: 150,
      efficiency: 1,
      ecology: 5,
      description: "Простое ведро для сбора дождевой воды"
    },
    {
      id: "barrel",
      name: "Бочка для воды",
      category: "water",
      tier: 2,
      level: 0,
      basePrice: 400,
      efficiency: 2,
      ecology: 6,
      description: "Большая бочка для сбора и хранения дождевой воды"
    },
    {
      id: "well",
      name: "Колодец",
      category: "water",
      tier: 3,
      level: 0,
      basePrice: 900,
      efficiency: 4,
      ecology: 7,
      description: "Традиционный колодец для получения грунтовых вод"
    },
    {
      id: "filter-system",
      name: "Система фильтрации",
      category: "water",
      tier: 4,
      level: 0,
      basePrice: 1800,
      efficiency: 6,
      ecology: 8,
      description: "Современная система фильтрации и очистки воды"
    },
    {
      id: "rain-collector",
      name: "Коллектор дождевой воды",
      category: "water",
      tier: 5,
      level: 0,
      basePrice: 3000,
      efficiency: 8,
      ecology: 9,
      description: "Профессиональная система сбора дождевой воды с крыши"
    },
    {
      id: "atmospheric-generator",
      name: "Атмосферный генератор",
      category: "water",
      tier: 6,
      level: 0,
      basePrice: 4500,
      efficiency: 10,
      ecology: 10,
      description: "Передовая технология извлечения воды из воздуха"
    }
  ],
  greenery: [
    {
      id: "grass",
      name: "Газонная трава",
      category: "greenery",
      tier: 1,
      level: 0,
      basePrice: 100,
      efficiency: 1,
      ecology: 4,
      description: "Простой газон для улучшения экологии участка"
    },
    {
      id: "flower-bed",
      name: "Клумба с цветами",
      category: "greenery",
      tier: 2,
      level: 0,
      basePrice: 300,
      efficiency: 2,
      ecology: 5,
      description: "Красивая клумба с цветами для озеленения"
    },
    {
      id: "bush",
      name: "Декоративный куст",
      category: "greenery",
      tier: 3,
      level: 0,
      basePrice: 700,
      efficiency: 4,
      ecology: 6,
      description: "Декоративный куст для улучшения экологии"
    },
    {
      id: "fruit-tree",
      name: "Фруктовое дерево",
      category: "greenery",
      tier: 4,
      level: 0,
      basePrice: 1500,
      efficiency: 6,
      ecology: 8,
      description: "Фруктовое дерево, которое приносит плоды и кислород"
    },
    {
      id: "oak-tree",
      name: "Дуб",
      category: "greenery",
      tier: 5,
      level: 0,
      basePrice: 2800,
      efficiency: 8,
      ecology: 9,
      description: "Могучий дуб - отличный производитель кислорода"
    },
    {
      id: "vertical-garden",
      name: "Вертикальный сад",
      category: "greenery",
      tier: 6,
      level: 0,
      basePrice: 4000,
      efficiency: 10,
      ecology: 10,
      description: "Современный вертикальный сад - максимальная эффективность на минимальной площади"
    }
  ]
};
