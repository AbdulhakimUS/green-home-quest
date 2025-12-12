import { ShopItem, CardType } from "@/types/game";

export const shopItems: Record<CardType, ShopItem[]> = {
  energy: [
    // Tier 1 - базовые
    { id: "hamster", name: "Бегающий хомяк", category: "energy", tier: 1, level: 0, basePrice: 200, efficiency: 1, ecology: 3, description: "Милый хомяк в колесе вырабатывает минимум энергии" },
    { id: "hand-crank", name: "Ручной генератор", category: "energy", tier: 1, level: 0, basePrice: 250, efficiency: 1, ecology: 4, description: "Простой ручной генератор" },
    { id: "dynamo-flashlight", name: "Динамо-фонарик", category: "energy", tier: 1, level: 0, basePrice: 180, efficiency: 1, ecology: 5, description: "Фонарик с динамо-машиной" },
    { id: "potato-battery", name: "Картофельная батарея", category: "energy", tier: 1, level: 0, basePrice: 150, efficiency: 1, ecology: 6, description: "Экологичная батарея из картофеля" },
    { id: "lemon-battery", name: "Лимонная батарея", category: "energy", tier: 1, level: 0, basePrice: 170, efficiency: 1, ecology: 6, description: "Кислотная батарея из лимонов" },
    // Tier 2
    { id: "bicycle-gen", name: "Велосипедный генератор", category: "energy", tier: 2, level: 0, basePrice: 500, efficiency: 2, ecology: 5, description: "Генератор на педальной тяге" },
    { id: "kinetic-floor", name: "Кинетический пол", category: "energy", tier: 2, level: 0, basePrice: 550, efficiency: 2, ecology: 6, description: "Пол генерирует энергию от шагов" },
    { id: "piezo-tiles", name: "Пьезо-плитка", category: "energy", tier: 2, level: 0, basePrice: 480, efficiency: 2, ecology: 7, description: "Плитка с пьезоэлементами" },
    { id: "thermal-gen", name: "Термо-генератор", category: "energy", tier: 2, level: 0, basePrice: 520, efficiency: 2, ecology: 5, description: "Генератор от разницы температур" },
    { id: "mini-windmill", name: "Мини-ветряк", category: "energy", tier: 2, level: 0, basePrice: 600, efficiency: 2, ecology: 8, description: "Маленький ветряной генератор" },
    // Tier 3
    { id: "solar-charger", name: "Солнечная зарядка", category: "energy", tier: 3, level: 0, basePrice: 1000, efficiency: 4, ecology: 8, description: "Портативная солнечная панель" },
    { id: "water-wheel-small", name: "Малое водяное колесо", category: "energy", tier: 3, level: 0, basePrice: 1100, efficiency: 4, ecology: 7, description: "Компактное водяное колесо" },
    { id: "bio-reactor-mini", name: "Мини-биореактор", category: "energy", tier: 3, level: 0, basePrice: 1200, efficiency: 4, ecology: 6, description: "Маленький биогазовый реактор" },
    { id: "stirling-engine", name: "Двигатель Стирлинга", category: "energy", tier: 3, level: 0, basePrice: 950, efficiency: 4, ecology: 7, description: "Тепловой двигатель Стирлинга" },
    { id: "flywheel-storage", name: "Маховик-накопитель", category: "energy", tier: 3, level: 0, basePrice: 1050, efficiency: 4, ecology: 8, description: "Механический накопитель энергии" },
    // Tier 4
    { id: "solar-panel", name: "Солнечная панель", category: "energy", tier: 4, level: 0, basePrice: 2000, efficiency: 6, ecology: 9, description: "Стандартная солнечная панель" },
    { id: "water-wheel", name: "Водяное колесо", category: "energy", tier: 4, level: 0, basePrice: 2200, efficiency: 6, ecology: 8, description: "Традиционное водяное колесо" },
    { id: "bio-generator", name: "Био-генератор", category: "energy", tier: 4, level: 0, basePrice: 2100, efficiency: 6, ecology: 7, description: "Генератор на биотопливе" },
    { id: "geothermal-pump", name: "Геотермальный насос", category: "energy", tier: 4, level: 0, basePrice: 2300, efficiency: 6, ecology: 9, description: "Тепловой насос от земли" },
    { id: "micro-hydro", name: "Микро-ГЭС", category: "energy", tier: 4, level: 0, basePrice: 2400, efficiency: 6, ecology: 8, description: "Маленькая гидроэлектростанция" },
    // Tier 5
    { id: "solar-array", name: "Солнечный массив", category: "energy", tier: 5, level: 0, basePrice: 3500, efficiency: 8, ecology: 9, description: "Большой массив солнечных панелей" },
    { id: "wind-gen", name: "Ветрогенератор", category: "energy", tier: 5, level: 0, basePrice: 3800, efficiency: 8, ecology: 10, description: "Мощный ветровой генератор" },
    { id: "biogas-plant", name: "Биогазовая установка", category: "energy", tier: 5, level: 0, basePrice: 3600, efficiency: 8, ecology: 7, description: "Производство биогаза из отходов" },
    { id: "tidal-gen", name: "Приливной генератор", category: "energy", tier: 5, level: 0, basePrice: 4000, efficiency: 8, ecology: 9, description: "Энергия приливов и отливов" },
    { id: "hydrogen-cell", name: "Водородный элемент", category: "energy", tier: 5, level: 0, basePrice: 3700, efficiency: 8, ecology: 10, description: "Топливный элемент на водороде" },
    // Tier 6 - максимальные
    { id: "wind-turbine", name: "Ветряная турбина", category: "energy", tier: 6, level: 0, basePrice: 5000, efficiency: 10, ecology: 10, description: "Мощная промышленная турбина" },
    { id: "solar-farm", name: "Солнечная ферма", category: "energy", tier: 6, level: 0, basePrice: 5500, efficiency: 10, ecology: 10, description: "Большая солнечная электростанция" },
    { id: "fusion-mini", name: "Мини-термояд", category: "energy", tier: 6, level: 0, basePrice: 6000, efficiency: 10, ecology: 10, description: "Экспериментальный термоядерный реактор" },
    { id: "wave-power", name: "Волновая станция", category: "energy", tier: 6, level: 0, basePrice: 5200, efficiency: 10, ecology: 9, description: "Энергия морских волн" },
    { id: "orbital-mirror", name: "Орбитальное зеркало", category: "energy", tier: 6, level: 0, basePrice: 5800, efficiency: 10, ecology: 10, description: "Космический концентратор солнечной энергии" },
  ],
  water: [
    // Tier 1 - базовые
    { id: "bucket", name: "Ведро для дождя", category: "water", tier: 1, level: 0, basePrice: 150, efficiency: 1, ecology: 5, description: "Простое ведро для сбора дождевой воды" },
    { id: "tarp-collector", name: "Тент-коллектор", category: "water", tier: 1, level: 0, basePrice: 180, efficiency: 1, ecology: 5, description: "Тент для сбора росы и дождя" },
    { id: "gutter-basic", name: "Простой желоб", category: "water", tier: 1, level: 0, basePrice: 200, efficiency: 1, ecology: 6, description: "Базовый водосточный желоб" },
    { id: "clay-pot", name: "Глиняный горшок", category: "water", tier: 1, level: 0, basePrice: 120, efficiency: 1, ecology: 7, description: "Традиционный глиняный сосуд для воды" },
    { id: "bamboo-pipe", name: "Бамбуковая труба", category: "water", tier: 1, level: 0, basePrice: 160, efficiency: 1, ecology: 8, description: "Экологичная труба из бамбука" },
    // Tier 2
    { id: "barrel", name: "Бочка для воды", category: "water", tier: 2, level: 0, basePrice: 400, efficiency: 2, ecology: 6, description: "Большая бочка для хранения воды" },
    { id: "rain-chain", name: "Дождевая цепь", category: "water", tier: 2, level: 0, basePrice: 450, efficiency: 2, ecology: 7, description: "Декоративная система сбора воды" },
    { id: "sand-filter", name: "Песчаный фильтр", category: "water", tier: 2, level: 0, basePrice: 480, efficiency: 2, ecology: 8, description: "Простой фильтр на основе песка" },
    { id: "cistern-small", name: "Малая цистерна", category: "water", tier: 2, level: 0, basePrice: 520, efficiency: 2, ecology: 6, description: "Компактная цистерна для воды" },
    { id: "fog-net", name: "Туманоуловитель", category: "water", tier: 2, level: 0, basePrice: 550, efficiency: 2, ecology: 9, description: "Сетка для сбора воды из тумана" },
    // Tier 3
    { id: "well", name: "Колодец", category: "water", tier: 3, level: 0, basePrice: 900, efficiency: 4, ecology: 7, description: "Традиционный колодец для грунтовых вод" },
    { id: "pump-manual", name: "Ручной насос", category: "water", tier: 3, level: 0, basePrice: 950, efficiency: 4, ecology: 8, description: "Механический водяной насос" },
    { id: "bio-filter", name: "Биофильтр", category: "water", tier: 3, level: 0, basePrice: 1000, efficiency: 4, ecology: 9, description: "Фильтрация через живые организмы" },
    { id: "rain-garden", name: "Дождевой сад", category: "water", tier: 3, level: 0, basePrice: 1100, efficiency: 4, ecology: 10, description: "Сад для сбора и фильтрации воды" },
    { id: "greywater-basic", name: "Базовая рециркуляция", category: "water", tier: 3, level: 0, basePrice: 1050, efficiency: 4, ecology: 7, description: "Простая система серых вод" },
    // Tier 4
    { id: "filter-system", name: "Система фильтрации", category: "water", tier: 4, level: 0, basePrice: 1800, efficiency: 6, ecology: 8, description: "Современная система очистки воды" },
    { id: "cistern-large", name: "Большая цистерна", category: "water", tier: 4, level: 0, basePrice: 2000, efficiency: 6, ecology: 7, description: "Промышленная цистерна для воды" },
    { id: "solar-still", name: "Солнечный дистиллятор", category: "water", tier: 4, level: 0, basePrice: 1900, efficiency: 6, ecology: 9, description: "Очистка воды солнечной энергией" },
    { id: "uv-purifier", name: "УФ-очиститель", category: "water", tier: 4, level: 0, basePrice: 2100, efficiency: 6, ecology: 8, description: "Ультрафиолетовая дезинфекция" },
    { id: "aquifer-pump", name: "Насос для водоносов", category: "water", tier: 4, level: 0, basePrice: 2200, efficiency: 6, ecology: 6, description: "Глубинный насос для грунтовых вод" },
    // Tier 5
    { id: "rain-collector", name: "Коллектор дождевой воды", category: "water", tier: 5, level: 0, basePrice: 3000, efficiency: 8, ecology: 9, description: "Профессиональная система сбора воды" },
    { id: "greywater-system", name: "Система серых вод", category: "water", tier: 5, level: 0, basePrice: 3200, efficiency: 8, ecology: 8, description: "Полная рециркуляция бытовой воды" },
    { id: "membrane-filter", name: "Мембранный фильтр", category: "water", tier: 5, level: 0, basePrice: 3100, efficiency: 8, ecology: 9, description: "Нанофильтрация воды" },
    { id: "rainwater-tank", name: "Резервуар дождевой воды", category: "water", tier: 5, level: 0, basePrice: 3300, efficiency: 8, ecology: 8, description: "Большой подземный резервуар" },
    { id: "water-recycler", name: "Рециклер воды", category: "water", tier: 5, level: 0, basePrice: 3400, efficiency: 8, ecology: 9, description: "Полный цикл переработки воды" },
    // Tier 6 - максимальные
    { id: "atmospheric-gen", name: "Атмосферный генератор", category: "water", tier: 6, level: 0, basePrice: 4500, efficiency: 10, ecology: 10, description: "Извлечение воды из воздуха" },
    { id: "desalination", name: "Опреснитель", category: "water", tier: 6, level: 0, basePrice: 5000, efficiency: 10, ecology: 8, description: "Опреснение морской воды" },
    { id: "closed-loop", name: "Замкнутый цикл", category: "water", tier: 6, level: 0, basePrice: 4800, efficiency: 10, ecology: 10, description: "100% рециркуляция воды" },
    { id: "cloud-seeding", name: "Засев облаков", category: "water", tier: 6, level: 0, basePrice: 5200, efficiency: 10, ecology: 7, description: "Искусственное вызывание осадков" },
    { id: "ice-harvester", name: "Ледяной комбайн", category: "water", tier: 6, level: 0, basePrice: 4600, efficiency: 10, ecology: 9, description: "Добыча воды из айсбергов" },
  ],
  greenery: [
    // Tier 1 - базовые
    { id: "grass", name: "Газонная трава", category: "greenery", tier: 1, level: 0, basePrice: 100, efficiency: 1, ecology: 4, description: "Простой газон для озеленения" },
    { id: "moss", name: "Мох", category: "greenery", tier: 1, level: 0, basePrice: 120, efficiency: 1, ecology: 5, description: "Неприхотливый мох" },
    { id: "clover", name: "Клевер", category: "greenery", tier: 1, level: 0, basePrice: 130, efficiency: 1, ecology: 6, description: "Полезный для почвы клевер" },
    { id: "fern-small", name: "Маленький папоротник", category: "greenery", tier: 1, level: 0, basePrice: 140, efficiency: 1, ecology: 5, description: "Компактный папоротник" },
    { id: "succulent", name: "Суккулент", category: "greenery", tier: 1, level: 0, basePrice: 110, efficiency: 1, ecology: 4, description: "Неприхотливое растение" },
    // Tier 2
    { id: "flower-bed", name: "Клумба с цветами", category: "greenery", tier: 2, level: 0, basePrice: 300, efficiency: 2, ecology: 5, description: "Красивая клумба для озеленения" },
    { id: "herbs", name: "Травяной сад", category: "greenery", tier: 2, level: 0, basePrice: 350, efficiency: 2, ecology: 6, description: "Сад с пряными травами" },
    { id: "ivy", name: "Плющ", category: "greenery", tier: 2, level: 0, basePrice: 280, efficiency: 2, ecology: 5, description: "Вьющийся плющ для стен" },
    { id: "fern-large", name: "Большой папоротник", category: "greenery", tier: 2, level: 0, basePrice: 320, efficiency: 2, ecology: 6, description: "Пышный папоротник" },
    { id: "bamboo-small", name: "Малый бамбук", category: "greenery", tier: 2, level: 0, basePrice: 380, efficiency: 2, ecology: 7, description: "Декоративный бамбук" },
    // Tier 3
    { id: "bush", name: "Декоративный куст", category: "greenery", tier: 3, level: 0, basePrice: 700, efficiency: 4, ecology: 6, description: "Декоративный куст для сада" },
    { id: "berry-bush", name: "Ягодный куст", category: "greenery", tier: 3, level: 0, basePrice: 750, efficiency: 4, ecology: 7, description: "Куст с ягодами" },
    { id: "rose-garden", name: "Розарий", category: "greenery", tier: 3, level: 0, basePrice: 800, efficiency: 4, ecology: 6, description: "Сад с розами" },
    { id: "bamboo-grove", name: "Бамбуковая роща", category: "greenery", tier: 3, level: 0, basePrice: 850, efficiency: 4, ecology: 8, description: "Группа бамбуковых растений" },
    { id: "hedge", name: "Живая изгородь", category: "greenery", tier: 3, level: 0, basePrice: 720, efficiency: 4, ecology: 7, description: "Зеленая ограда" },
    // Tier 4
    { id: "fruit-tree", name: "Фруктовое дерево", category: "greenery", tier: 4, level: 0, basePrice: 1500, efficiency: 6, ecology: 8, description: "Дерево приносит плоды и кислород" },
    { id: "pine-tree", name: "Сосна", category: "greenery", tier: 4, level: 0, basePrice: 1600, efficiency: 6, ecology: 8, description: "Вечнозеленая сосна" },
    { id: "willow", name: "Ива", category: "greenery", tier: 4, level: 0, basePrice: 1400, efficiency: 6, ecology: 7, description: "Красивая плакучая ива" },
    { id: "maple", name: "Клён", category: "greenery", tier: 4, level: 0, basePrice: 1550, efficiency: 6, ecology: 8, description: "Красивый клён" },
    { id: "birch", name: "Берёза", category: "greenery", tier: 4, level: 0, basePrice: 1450, efficiency: 6, ecology: 8, description: "Белоствольная берёза" },
    // Tier 5
    { id: "oak-tree", name: "Дуб", category: "greenery", tier: 5, level: 0, basePrice: 2800, efficiency: 8, ecology: 9, description: "Могучий дуб - отличный источник кислорода" },
    { id: "redwood", name: "Секвойя", category: "greenery", tier: 5, level: 0, basePrice: 3000, efficiency: 8, ecology: 10, description: "Гигантское древнее дерево" },
    { id: "greenhouse", name: "Теплица", category: "greenery", tier: 5, level: 0, basePrice: 2900, efficiency: 8, ecology: 7, description: "Закрытый сад для круглогодичного выращивания" },
    { id: "orchard", name: "Фруктовый сад", category: "greenery", tier: 5, level: 0, basePrice: 3100, efficiency: 8, ecology: 9, description: "Целый сад фруктовых деревьев" },
    { id: "botanical", name: "Ботанический уголок", category: "greenery", tier: 5, level: 0, basePrice: 2850, efficiency: 8, ecology: 9, description: "Коллекция редких растений" },
    // Tier 6 - максимальные
    { id: "vertical-garden", name: "Вертикальный сад", category: "greenery", tier: 6, level: 0, basePrice: 4000, efficiency: 10, ecology: 10, description: "Максимальная эффективность на минимальной площади" },
    { id: "rooftop-forest", name: "Лес на крыше", category: "greenery", tier: 6, level: 0, basePrice: 4500, efficiency: 10, ecology: 10, description: "Полноценный лес на крыше здания" },
    { id: "biosphere", name: "Биосфера", category: "greenery", tier: 6, level: 0, basePrice: 5000, efficiency: 10, ecology: 10, description: "Замкнутая экосистема" },
    { id: "algae-farm", name: "Ферма водорослей", category: "greenery", tier: 6, level: 0, basePrice: 4200, efficiency: 10, ecology: 9, description: "Производство кислорода водорослями" },
    { id: "ancient-grove", name: "Древняя роща", category: "greenery", tier: 6, level: 0, basePrice: 4800, efficiency: 10, ecology: 10, description: "Священная роща с древними деревьями" },
  ]
};

// Функция для получения всех предметов
export const getAllItems = (): ShopItem[] => {
  return [...shopItems.energy, ...shopItems.water, ...shopItems.greenery];
};
