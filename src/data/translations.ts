import { Language } from "@/contexts/LanguageContext";

export const translations: Record<Language, Record<string, string>> = {
  ru: {
    // App
    "app.title": "Эко Дом",
    "app.subtitle": "Создайте самый экологичный дом!",

    // Login
    "login.join": "Присоединиться к игре",
    "login.joinDesc": "Введите 6-значный код игры и никнейм",
    "login.code": "Код игры (6 цифр)",
    "login.nickname": "Ваш никнейм",
    "login.start": "Начать игру",
    "login.loading": "Загрузка...",
    "login.createAdmin": "Создать игру (админ)",
    "login.adminTitle": "Вход администратора",
    "login.adminDesc": "Войдите для управления игрой",
    "login.login": "Логин",
    "login.password": "Пароль",
    "login.enter": "Войти",
    "login.back": "Назад",
    "login.gameControl": "Управление игрой",
    "login.selectAction": "Выберите действие",
    "login.createRoom": "Создать новую комнату",
    "login.joinExisting": "Присоединиться к существующей",
    "login.createRoomDesc": "Создать новую игровую комнату",
    "login.initialBalance": "Начальный баланс игроков ($)",
    "login.creating": "Создание...",
    "login.roomCode": "Код комнаты (6 цифр)",
    "login.joining": "Загрузка...",
    "login.joinRoom": "Присоединиться",
    "login.acceptRules": "Необходимо принять правила игры",
    "login.acceptRulesText": "Я прочитал(а) и принимаю правила игры.",
    "login.readRules": "Читать правила",
    "login.waitingApproval": "Ожидание подтверждения",
    "login.waitingDesc": "Администратор должен подтвердить ваш вход в игру. Пожалуйста, подождите...",
    "login.denied": "Ваша заявка отклонена администратором",
    "login.blocked": "Вы заблокированы в этой игре",
    "login.reconnected": "Сессия восстановлена! Ваш прогресс сохранён.",
    "login.defaultLanguage": "Язык по умолчанию",

    // Errors
    "error.title": "Ошибка",
    "error.fillFields": "Заполните все поля",
    "error.codeFormat": "Код должен состоять из 6 цифр",
    "error.gameNotFound": "Игра с таким кодом не найдена",
    "error.gameStarted": "Игра уже началась. Присоединиться нельзя.",
    "error.nicknameTaken": "Этот никнейм уже занят",
    "error.createPlayer": "Не удалось создать игрока",
    "error.wrongCredentials": "Неверный логин или пароль",
    "error.createGame": "Не удалось создать игру",
    "error.invalidBalance": "Введите корректный начальный баланс",
    "error.invalidCode": "Введите корректный 6-значный код",

    // Success
    "success.title": "Успешно!",
    "success.welcome": "Добро пожаловать",
    "success.welcomeAdmin": "Добро пожаловать, администратор",
    "success.gameCreated": "Игра создана!",
    "success.gameCode": "Код игры",
    "success.joinedGame": "Присоединились к игре",

    // Nav
    "nav.home": "Дом",
    "nav.shop": "Магазин",
    "nav.cards": "Карты",
    "nav.market": "Рынок",
    "nav.missions": "Миссии",
    "nav.history": "История",
    "nav.level": "Ур.",
    "nav.maxLevel": "Макс",
    "nav.exitRoom": "Выйти из комнаты",
    "nav.stage2": "Этап 2",

    // Exit
    "exit.title": "Выйти из комнаты?",
    "exit.message": "Вы точно хотите выйти из игры? Ваш прогресс будет потерян.",
    "exit.cancel": "Отмена",
    "exit.confirm": "Выйти",

    // Categories
    "category.energy": "Энергия",
    "category.water": "Вода",
    "category.greenery": "Зелень",
    "category.oxygen": "Кислород",

    // Tiers
    "tier.1": "Базовые",
    "tier.2": "Улучшенные",
    "tier.3": "Продвинутые",
    "tier.4": "Профессиональные",
    "tier.5": "Элитные",
    "tier.6": "Легендарные",

    // HomeTab
    "home.title": "Ваш Эко Дом",
    "home.titleStage2": "🏰 Ваш Эко Дворец",
    "home.level": "Уровень",
    "home.waterPressure": "Напор воды",
    "home.electricity": "Электричество",
    "home.buyItems": "Купите предметы в магазине!",
    "home.pendingRewards": "📦 Ожидающие награды",
    "home.pendingRewardsDesc": "Освободите слот в инвентаре, чтобы забрать награды",
    "home.itemLevel": "Ур.",

    // ShopTab
    "shop.selectCard": "Выберите карту",
    "shop.selectCardDesc": "Для доступа к магазину сначала выберите карту в разделе «Карты»",
    "shop.title": "Магазин",
    "shop.category": "Категория",
    "shop.inventory": "Инвентарь",
    "shop.inventoryFull": "Инвентарь заполнен!",
    "shop.inventoryFullDesc": "⚠️ Инвентарь заполнен! Продайте предмет на рынке для покупки нового.",
    "shop.inventoryFullToast": "Инвентарь заполнен! Продайте предмет на рынке.",
    "shop.stage2Locked": "На Этапе 2 базовые предметы недоступны",
    "shop.notEnough": "Недостаточно средств!",
    "shop.upgrade": "Улучшить",
    "shop.buy": "Купить",
    "shop.tier": "Тир",
    "shop.stage1": "Этап 1",

    // CardsTab
    "cards.title": "Выберите категорию",
    "cards.desc": "Выберите карту для открытия магазина",
    "cards.selected": "Выбрано",
    "cards.selectedCard": "Выбрана карта",
    "cards.energyDesc": "Солнечные панели, ветряки и другие источники энергии",
    "cards.waterDesc": "Системы сбора дождевой воды и фильтрации",
    "cards.greeneryDesc": "Деревья, кусты и растения для экологии",

    // MarketTab
    "market.selectCard": "Выберите карту",
    "market.selectCardDesc": "Для доступа к рынку сначала выберите карту",
    "market.title": "Рынок",
    "market.subtitle": "Покупайте и продавайте • Комиссия: 7%",
    "market.sellToPlayers": "Продать игрокам",
    "market.listOnMarket": "Выставить на рынок",
    "market.noItems": "Нет предметов",
    "market.level": "Уровень",
    "market.max": "Макс",
    "market.basePrice": "Базовая",
    "market.maxDiscount": "Макс (-25%)",
    "market.yourPrice": "Ваша цена",
    "market.exceedsLimit": "Превышает лимит!",
    "market.back": "Назад",
    "market.listFor": "Выставить за",
    "market.sellToBot": "Продать боту (50%)",
    "market.sellToBotTitle": "Продажа боту",
    "market.sellToBotDesc": "Продажа предметов Этапа 1 за 50% стоимости. Деньги начисляются сразу.",
    "market.lots": "лотов",
    "market.noLots": "Нет лотов",
    "market.sold": "Продано",
    "market.from": "от",
    "market.remove": "Убрать",
    "market.buy": "Купить",

    // MissionsPanel
    "missions.title": "Миссии",
    "missions.alreadyDone": "Миссия уже выполнена",
    "missions.gameNotActive": "Игра не активна",
    "missions.reward": "Награда",
    "missions.claim": "Забрать",

    // Mission titles/descriptions
    "mission.house_3.title": "Первый шаг",
    "mission.house_3.desc": "Построй дом до уровня 3",
    "mission.house_5.title": "Начальное развитие",
    "mission.house_5.desc": "Построй дом до уровня 5",
    "mission.house_8.title": "Уверенный рост",
    "mission.house_8.desc": "Построй дом до уровня 8",
    "mission.house_10.title": "Опытный строитель",
    "mission.house_10.desc": "Построй дом до уровня 10",
    "mission.house_15.title": "Мастер строительства",
    "mission.house_15.desc": "Построй дом до уровня 15",
    "mission.house_20.title": "Эксперт строительства",
    "mission.house_20.desc": "Построй дом до уровня 20",
    "mission.max_level.title": "Максимальное развитие",
    "mission.max_level.desc": "Достигни максимального уровня дома (25)",
    "mission.money_30k.title": "Первый капитал",
    "mission.money_30k.desc": "Накопи $30,000",
    "mission.money_75k.title": "Растущие сбережения",
    "mission.money_75k.desc": "Накопи $75,000",
    "mission.money_150k.title": "Солидный капитал",
    "mission.money_150k.desc": "Накопи $150,000",
    "mission.items_3.title": "Первые покупки",
    "mission.items_3.desc": "Собери 3 разных предмета",
    "mission.items_5.title": "Начинающий коллекционер",
    "mission.items_5.desc": "Собери 5 разных предметов",
    "mission.items_10.title": "Коллекционер",
    "mission.items_10.desc": "Собери 10 разных предметов",
    "mission.items_15.title": "Опытный коллекционер",
    "mission.items_15.desc": "Собери 15 разных предметов",
    "mission.items_20.title": "Продвинутый коллекционер",
    "mission.items_20.desc": "Собери 20 разных предметов",
    "mission.items_30.title": "Мастер коллекций",
    "mission.items_30.desc": "Собери 30 разных предметов",
    "mission.all_categories.title": "Разносторонний",
    "mission.all_categories.desc": "Купи предметы из всех 3 категорий",
    "mission.energy_5.title": "Энергетик",
    "mission.energy_5.desc": "Купи 5 предметов категории Энергия",
    "mission.water_5.title": "Водный мастер",
    "mission.water_5.desc": "Купи 5 предметов категории Вода",
    "mission.greenery_5.title": "Зелёный друг",
    "mission.greenery_5.desc": "Купи 5 предметов категории Зелень",
    "mission.energy_10.title": "Энергетический магнат",
    "mission.energy_10.desc": "Купи 10 предметов категории Энергия",
    "mission.water_10.title": "Повелитель воды",
    "mission.water_10.desc": "Купи 10 предметов категории Вода",
    "mission.greenery_10.title": "Хранитель природы",
    "mission.greenery_10.desc": "Купи 10 предметов категории Зелень",
    "mission.oxygen_15.title": "Первый глоток",
    "mission.oxygen_15.desc": "Достигни 15 единиц кислорода",
    "mission.oxygen_30.title": "Свежий воздух",
    "mission.oxygen_30.desc": "Достигни 30 единиц кислорода",
    "mission.oxygen_60.title": "Дыши полной грудью",
    "mission.oxygen_60.desc": "Достигни 60 единиц кислорода",
    "mission.oxygen_100.title": "Чистый воздух",
    "mission.oxygen_100.desc": "Достигни 100 единиц кислорода",
    "mission.oxygen_150.title": "Кислородный рай",
    "mission.oxygen_150.desc": "Достигни 150 единиц кислорода",

    // AdminPanel
    "admin.title": "Админ Панель",
    "admin.back": "Назад",
    "admin.finish": "Завершить",
    "admin.pause": "Пауза",
    "admin.resume": "Возобновить",
    "admin.gameCode": "Код игры",
    "admin.linkCopied": "Ссылка скопирована!",
    "admin.waiting": "Ожидание",
    "admin.timeLeft": "Осталось",
    "admin.paused": "Пауза",
    "admin.finished": "Игра завершена",
    "admin.startGame": "Запуск игры",
    "admin.gameTime": "Время игры (минуты)",
    "admin.startBalance": "Начальный баланс ($)",
    "admin.start": "Начать игру",
    "admin.restart": "Начать заново",
    "admin.pendingEntries": "Заявки на вход",
    "admin.approve": "Принять",
    "admin.deny": "Отклонить",
    "admin.participants": "Участники",
    "admin.online": "Онлайн",
    "admin.total": "Всего",
    "admin.noPlayers": "Пока нет участников",
    "admin.stage": "Этап",
    "admin.level": "Ур.",
    "admin.balance": "Баланс",
    "admin.itemsCount": "Предметов",
    "admin.missionsCount": "Миссий",
    "admin.deleted": "Удалённые",
    "admin.actionLogs": "Логи действий",
    "admin.noLogs": "Нет логов",
    "admin.system": "Система",
    "admin.market": "Рынок",
    "admin.noLots": "Нет лотов",
    "admin.player": "Игрок",
    "admin.moneyControl": "Управление деньгами",
    "admin.amount": "Сумма",
    "admin.add": "Добавить",
    "admin.take": "Забрать",
    "admin.levelControl": "Управление уровнем",
    "admin.levelRange": "Уровень (1-50)",
    "admin.setLevel": "Установить",
    "admin.purchaseHistory": "История покупок",
    "admin.inventory": "Инвентарь",
    "admin.empty": "Пусто",
    "admin.missions": "Миссии",
    "admin.noCompleted": "Нет выполненных",
    "admin.block": "Заблокировать",
    "admin.delete": "Удалить",
    "admin.deleteConfirm": "Удалить игрока",
    "admin.errorTime": "Введите корректное время",
    "admin.errorBalance": "Введите корректный баланс",

    // ItemDetailsDialog
    "item.currentLevel": "Текущий уровень",
    "item.efficiency": "Эффективность",
    "item.ecology": "Экологичность",
    "item.tierLevel": "Уровень предмета",
    "item.category": "Категория",
    "item.basePrice": "Базовая цена",

    // Leaderboard
    "leaderboard.title": "Таблица лидеров",
    "leaderboard.houseLevel": "Уровень дома",
    "leaderboard.points": "очков",

    // Events
    "events.title": "Активные события",

    // Notifications
    "notif.title": "Уведомления",
    "notif.clear": "Очистить",
    "notif.empty": "Нет уведомлений",
    "notif.secondsAgo": "с назад",
    "notif.minutesAgo": "м назад",
    "notif.hoursAgo": "ч назад",

    // PurchaseHistory
    "history.title": "История покупок",
    "history.loading": "Загрузка...",
    "history.empty": "Пока нет покупок",
    "history.level": "Уровень",

    // WelcomeModal
    "welcome.title": "Добро пожаловать в Eco Home!",
    "welcome.creators": "Создали сайт:",
    "welcome.collaboration": "По поводу сотрудничества и создания сайта:",

    // Footer
    "footer.developer": "Разработчик",

    // Rules
    "rules.title": "Правила игры «Эко Дом»",
    "rules.fullTitle": "ПРАВИЛА / RULES / QOIDALAR",
    "rules.objective": "Цель игры",
    "rules.objectiveDesc": "Создайте максимально экологичный дом, достигнув 50 уровня.",
    "rules.winner": "Победитель:",
    "rules.winnerDesc": "Выигрывает тот, кто достиг максимального уровня дома и сохранил больше всего денег!",
    "rules.howToPlay": "Как играть",
    "rules.step1": "Выберите карту — Энергия, Вода или Зелень",
    "rules.step2": "Покупайте предметы в магазине для выбранной категории",
    "rules.step3": "Повышайте уровень дома — каждая покупка увеличивает уровень",
    "rules.step4": "Выполняйте миссии для получения бонусных денег",
    "rules.shop": "Магазин",
    "rules.shopItems": "30 предметов в каждой категории (Энергия, Вода, Зелень)",
    "rules.shopExpensive": "Дорогие предметы дают больше уровня и более экологичны",
    "rules.shopUpgrade": "Можно улучшать предметы, покупая их повторно",
    "rules.shopPrice": "Цена растёт с каждым уровнем предмета",
    "rules.market": "Рынок игроков",
    "rules.marketSell": "Продавайте свои предметы другим игрокам",
    "rules.marketPrice": "Максимальная цена — 75% от базовой стоимости",
    "rules.marketFee": "Комиссия рынка — 7%",
    "rules.marketLimit": "Максимум 5 лотов на категорию",
    "rules.bonuses": "Бонусы и награды",
    "rules.missions": "Миссии — выполняйте задания за деньги",
    "rules.treasures": "Клады — 4 скрытых сокровища (+$5,000 каждый)",
    "rules.allTreasures": "Бонус за все клады — +$20,000",
    "rules.itemRewards": "Награды за предметы — бонусы за 50, 75, 100 предметов",
    "rules.tips": "Советы",
    "rules.tip1": "💡 Выбирайте более экологичные предметы — они эффективнее",
    "rules.tip2": "💡 Следите за балансом — не тратьте всё сразу",
    "rules.tip3": "💡 Выполняйте миссии для дополнительного дохода",
    "rules.tip4": "💡 Используйте рынок для выгодных сделок",
    "rules.goodLuck": "Удачи в создании экологичного дома! 🌿🏠",
    "rules.fullText": `📋 ПРАВИЛА ИГРЫ «ЭКО ДОМ»

🎯 ЦЕЛЬ ИГРЫ
Построить самый экологичный дом, достигнув максимального уровня (50).
Победитель — игрок с наивысшим уровнем дома. При равном уровне побеждает тот, у кого больше денег.

🚪 ВХОД В ИГРУ
• Игрок может присоединиться в любое время (даже во время матча)
• Вход требует подтверждения администратора (approve/deny)
• При повторном входе в течение 3 часов прогресс восстанавливается автоматически
• Перед входом необходимо принять правила игры

📦 ИНВЕНТАРЬ
• Максимум 5 предметов в каждой категории (Энергия, Вода, Зелень)
• При заполненном инвентаре (5/5) покупка новых предметов блокируется
• Чтобы купить новый предмет — сначала продайте старый на рынке
• Награды за миссии при полном инвентаре уходят во временное хранилище

🛒 МАГАЗИН
• 30 предметов в каждой категории (6 тиров)
• Цена растёт с каждым уровнем предмета (×1.5)
• Каждая покупка повышает уровень дома
• Более дорогие предметы дают больше уровня

🏪 РЫНОК
• Продавайте предметы другим игрокам
• Максимальная цена — 75% от базовой стоимости
• Комиссия рынка — 7%
• Максимум 5 лотов на категорию от одного игрока
• Купленный предмет отображается как «Продано» 5 секунд

📊 ЭТАПЫ
• Этап 1 (уровни 1-25): базовый дом, все предметы доступны
• Этап 2 (уровни 26-50): новый дизайн, предметы Тир 1-3 заблокированы
• На Этапе 2 старые предметы можно продать боту за 50% стоимости

🎯 МИССИИ
• Выполняйте задания для получения бонусных денег
• Миссии по уровню дома, количеству предметов, кислороду и деньгам

🎁 БОНУСЫ
• 4 скрытых клада (+$5,000 каждый)
• Бонус за все клады — +$20,000
• Награды за 50, 75, 100 предметов

⚠️ ЗАПРЕЩЕНО
• Использование багов и эксплойтов (баг-абьюз)
• Дублирование предметов (дюп)
• Обход лимитов инвентаря
• Любые попытки обмана системы
• Нарушители будут заблокированы администратором

👑 ПРАВА АДМИНИСТРАТОРА
• Подтверждение/отклонение входа игроков
• Выдача и изъятие предметов
• Изменение баланса и уровня
• Откат прогресса
• Удаление дублированных предметов
• Кик и блокировка игроков

🔄 ВОССТАНОВЛЕНИЕ
• При вылете данные сохраняются автоматически каждые 12 секунд
• При повторном входе (тот же никнейм, в течение 3 часов) прогресс восстанавливается
• Если прошло более 3 часов — новый игрок с нуля

---
📋 GAME RULES "ECO HOME"

🎯 OBJECTIVE
Build the most eco-friendly home by reaching the maximum level (50).
The winner is the player with the highest house level. In case of a tie, the player with more money wins.

🚪 JOINING
• Players can join at any time (even during an active match)
• Entry requires admin approval (approve/deny)
• Reconnecting within 3 hours restores all progress automatically
• Players must accept rules before joining

📦 INVENTORY
• Maximum 5 items per category (Energy, Water, Greenery)
• When inventory is full (5/5), purchases are blocked
• Sell an item on the market to free up space
• Mission rewards go to pending storage when inventory is full

🛒 SHOP
• 30 items per category (6 tiers)
• Price increases with each item level (×1.5)
• Each purchase increases house level
• More expensive items give more level

🏪 MARKET
• Sell items to other players
• Maximum price — 75% of base cost
• Market fee — 7%
• Maximum 5 listings per category
• Purchased items show as "Sold" for 5 seconds

📊 STAGES
• Stage 1 (levels 1-25): basic house, all items available
• Stage 2 (levels 26-50): new design, Tier 1-3 items locked
• Stage 2 players can sell old items to bot for 50% value

⚠️ PROHIBITED
• Bug exploitation (bug abuse)
• Item duplication (duping)
• Bypassing inventory limits
• Any attempts to cheat the system
• Violators will be blocked by admin

---
📋 O'YIN QOIDALARI "EKO UY"

🎯 MAQSAD
Eng ekologik uyni qurib, maksimal darajaga (50) yetish.
G'olib — eng yuqori uy darajasiga ega o'yinchi. Teng darajada ko'proq pulga ega bo'lgan g'olib.

🚪 KIRISH
• O'yinchi istalgan vaqtda qo'shilishi mumkin (match paytida ham)
• Kirish uchun admin tasdiqlashi kerak (approve/deny)
• 3 soat ichida qayta kirganida barcha progress tiklanadi
• Kirishdan oldin qoidalarni qabul qilish kerak

📦 INVENTAR
• Har bir kategoriyada maksimum 5 narsa (Energiya, Suv, Ko'katlar)
• Inventar to'lganida (5/5) xarid bloklanadi
• Yangi narsa olish uchun avval eskisini bozorda soting
• Inventar to'lganida vazifa mukofotlari kutish xotirasiga o'tadi

🛒 DO'KON
• Har kategoriyada 30 narsa (6 daraja)
• Narx har bir daraja bilan oshadi (×1.5)
• Har xarid uy darajasini oshiradi

🏪 BOZOR
• Narsalarni boshqa o'yinchilarga soting
• Maksimal narx — asosiy qiymatning 75%
• Bozor komissiyasi — 7%
• Kategoriyada maksimum 5 ta e'lon
• Sotib olingan narsa 5 soniya "Sotildi" deb ko'rsatiladi

📊 BOSQICHLAR
• 1-bosqich (1-25 daraja): oddiy uy, barcha narsalar mavjud
• 2-bosqich (26-50 daraja): yangi dizayn, 1-3 daraja narsalari bloklanadi
• 2-bosqichda eski narsalarni botga 50% narxda sotish mumkin

⚠️ TAQIQLANADI
• Xatolardan foydalanish
• Narsalarni nusxalash (dup)
• Inventar limitlarini chetlab o'tish
• Qoidabuzarlar admin tomonidan bloklanadi
`,
  },
  en: {
    // App
    "app.title": "Eco Home",
    "app.subtitle": "Create the most eco-friendly home!",

    // Login
    "login.join": "Join Game",
    "login.joinDesc": "Enter 6-digit game code and nickname",
    "login.code": "Game code (6 digits)",
    "login.nickname": "Your nickname",
    "login.start": "Start Game",
    "login.loading": "Loading...",
    "login.createAdmin": "Create game (admin)",
    "login.adminTitle": "Admin Login",
    "login.adminDesc": "Login to manage the game",
    "login.login": "Login",
    "login.password": "Password",
    "login.enter": "Enter",
    "login.back": "Back",
    "login.gameControl": "Game Control",
    "login.selectAction": "Select action",
    "login.createRoom": "Create new room",
    "login.joinExisting": "Join existing room",
    "login.createRoomDesc": "Create a new game room",
    "login.initialBalance": "Players' starting balance ($)",
    "login.creating": "Creating...",
    "login.roomCode": "Room code (6 digits)",
    "login.joining": "Loading...",
    "login.joinRoom": "Join",
    "login.acceptRules": "You must accept the game rules",
    "login.acceptRulesText": "I have read and accept the game rules.",
    "login.readRules": "Read rules",
    "login.waitingApproval": "Waiting for approval",
    "login.waitingDesc": "The administrator must confirm your entry. Please wait...",
    "login.denied": "Your request was denied by the administrator",
    "login.blocked": "You are blocked from this game",
    "login.reconnected": "Session restored! Your progress is saved.",
    "login.defaultLanguage": "Default language",

    // Errors
    "error.title": "Error",
    "error.fillFields": "Fill in all fields",
    "error.codeFormat": "Code must be 6 digits",
    "error.gameNotFound": "Game with this code not found",
    "error.gameStarted": "Game already started. Cannot join.",
    "error.nicknameTaken": "This nickname is taken",
    "error.createPlayer": "Failed to create player",
    "error.wrongCredentials": "Wrong login or password",
    "error.createGame": "Failed to create game",
    "error.invalidBalance": "Enter valid starting balance",
    "error.invalidCode": "Enter valid 6-digit code",

    // Success
    "success.title": "Success!",
    "success.welcome": "Welcome",
    "success.welcomeAdmin": "Welcome, administrator",
    "success.gameCreated": "Game created!",
    "success.gameCode": "Game code",
    "success.joinedGame": "Joined game",

    // Nav
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.cards": "Cards",
    "nav.market": "Market",
    "nav.missions": "Missions",
    "nav.history": "History",
    "nav.level": "Lv.",
    "nav.maxLevel": "Max",
    "nav.exitRoom": "Exit room",
    "nav.stage2": "Stage 2",

    // Exit
    "exit.title": "Exit room?",
    "exit.message": "Are you sure you want to exit? Your progress will be lost.",
    "exit.cancel": "Cancel",
    "exit.confirm": "Exit",

    // Categories
    "category.energy": "Energy",
    "category.water": "Water",
    "category.greenery": "Greenery",
    "category.oxygen": "Oxygen",

    // Tiers
    "tier.1": "Basic",
    "tier.2": "Improved",
    "tier.3": "Advanced",
    "tier.4": "Professional",
    "tier.5": "Elite",
    "tier.6": "Legendary",

    // HomeTab
    "home.title": "Your Eco Home",
    "home.titleStage2": "🏰 Your Eco Palace",
    "home.level": "Level",
    "home.waterPressure": "Water pressure",
    "home.electricity": "Electricity",
    "home.buyItems": "Buy items in the shop!",
    "home.pendingRewards": "📦 Pending rewards",
    "home.pendingRewardsDesc": "Free up an inventory slot to claim rewards",
    "home.itemLevel": "Lv.",

    // ShopTab
    "shop.selectCard": "Select a card",
    "shop.selectCardDesc": "To access the shop, first select a card in the \"Cards\" section",
    "shop.title": "Shop",
    "shop.category": "Category",
    "shop.inventory": "Inventory",
    "shop.inventoryFull": "Inventory full!",
    "shop.inventoryFullDesc": "⚠️ Inventory full! Sell an item on the market to buy a new one.",
    "shop.inventoryFullToast": "Inventory full! Sell an item on the market.",
    "shop.stage2Locked": "Basic items unavailable in Stage 2",
    "shop.notEnough": "Not enough money!",
    "shop.upgrade": "Upgrade",
    "shop.buy": "Buy",
    "shop.tier": "Tier",
    "shop.stage1": "Stage 1",

    // CardsTab
    "cards.title": "Choose a category",
    "cards.desc": "Select a card to open the shop",
    "cards.selected": "Selected",
    "cards.selectedCard": "Selected card",
    "cards.energyDesc": "Solar panels, wind turbines and other energy sources",
    "cards.waterDesc": "Rainwater collection and filtration systems",
    "cards.greeneryDesc": "Trees, bushes and plants for ecology",

    // MarketTab
    "market.selectCard": "Select a card",
    "market.selectCardDesc": "To access the market, first select a card",
    "market.title": "Market",
    "market.subtitle": "Buy and sell • Fee: 7%",
    "market.sellToPlayers": "Sell to players",
    "market.listOnMarket": "List on market",
    "market.noItems": "No items",
    "market.level": "Level",
    "market.max": "Max",
    "market.basePrice": "Base",
    "market.maxDiscount": "Max (-25%)",
    "market.yourPrice": "Your price",
    "market.exceedsLimit": "Exceeds limit!",
    "market.back": "Back",
    "market.listFor": "List for",
    "market.sellToBot": "Sell to bot (50%)",
    "market.sellToBotTitle": "Sell to bot",
    "market.sellToBotDesc": "Sell Stage 1 items for 50% value. Money credited immediately.",
    "market.lots": "lots",
    "market.noLots": "No lots",
    "market.sold": "Sold",
    "market.from": "by",
    "market.remove": "Remove",
    "market.buy": "Buy",

    // MissionsPanel
    "missions.title": "Missions",
    "missions.alreadyDone": "Mission already completed",
    "missions.gameNotActive": "Game not active",
    "missions.reward": "Reward",
    "missions.claim": "Claim",

    // Mission titles
    "mission.house_3.title": "First Step",
    "mission.house_3.desc": "Build house to level 3",
    "mission.house_5.title": "Initial Development",
    "mission.house_5.desc": "Build house to level 5",
    "mission.house_8.title": "Confident Growth",
    "mission.house_8.desc": "Build house to level 8",
    "mission.house_10.title": "Experienced Builder",
    "mission.house_10.desc": "Build house to level 10",
    "mission.house_15.title": "Master Builder",
    "mission.house_15.desc": "Build house to level 15",
    "mission.house_20.title": "Expert Builder",
    "mission.house_20.desc": "Build house to level 20",
    "mission.max_level.title": "Maximum Development",
    "mission.max_level.desc": "Reach max house level (25)",
    "mission.money_30k.title": "First Capital",
    "mission.money_30k.desc": "Save $30,000",
    "mission.money_75k.title": "Growing Savings",
    "mission.money_75k.desc": "Save $75,000",
    "mission.money_150k.title": "Solid Capital",
    "mission.money_150k.desc": "Save $150,000",
    "mission.items_3.title": "First Purchases",
    "mission.items_3.desc": "Collect 3 items",
    "mission.items_5.title": "Beginner Collector",
    "mission.items_5.desc": "Collect 5 items",
    "mission.items_10.title": "Collector",
    "mission.items_10.desc": "Collect 10 items",
    "mission.items_15.title": "Experienced Collector",
    "mission.items_15.desc": "Collect 15 items",
    "mission.items_20.title": "Advanced Collector",
    "mission.items_20.desc": "Collect 20 items",
    "mission.items_30.title": "Master Collector",
    "mission.items_30.desc": "Collect 30 items",
    "mission.all_categories.title": "Versatile",
    "mission.all_categories.desc": "Buy items from all 3 categories",
    "mission.energy_5.title": "Energizer",
    "mission.energy_5.desc": "Buy 5 Energy items",
    "mission.water_5.title": "Water Master",
    "mission.water_5.desc": "Buy 5 Water items",
    "mission.greenery_5.title": "Green Friend",
    "mission.greenery_5.desc": "Buy 5 Greenery items",
    "mission.energy_10.title": "Energy Magnate",
    "mission.energy_10.desc": "Buy 10 Energy items",
    "mission.water_10.title": "Water Lord",
    "mission.water_10.desc": "Buy 10 Water items",
    "mission.greenery_10.title": "Nature Guardian",
    "mission.greenery_10.desc": "Buy 10 Greenery items",
    "mission.oxygen_15.title": "First Breath",
    "mission.oxygen_15.desc": "Reach 15 oxygen",
    "mission.oxygen_30.title": "Fresh Air",
    "mission.oxygen_30.desc": "Reach 30 oxygen",
    "mission.oxygen_60.title": "Breathe Deep",
    "mission.oxygen_60.desc": "Reach 60 oxygen",
    "mission.oxygen_100.title": "Clean Air",
    "mission.oxygen_100.desc": "Reach 100 oxygen",
    "mission.oxygen_150.title": "Oxygen Paradise",
    "mission.oxygen_150.desc": "Reach 150 oxygen",

    // AdminPanel
    "admin.title": "Admin Panel",
    "admin.back": "Back",
    "admin.finish": "Finish",
    "admin.pause": "Pause",
    "admin.resume": "Resume",
    "admin.gameCode": "Game code",
    "admin.linkCopied": "Link copied!",
    "admin.waiting": "Waiting",
    "admin.timeLeft": "Time left",
    "admin.paused": "Paused",
    "admin.finished": "Game finished",
    "admin.startGame": "Start Game",
    "admin.gameTime": "Game time (minutes)",
    "admin.startBalance": "Starting balance ($)",
    "admin.start": "Start game",
    "admin.restart": "Restart",
    "admin.pendingEntries": "Pending entries",
    "admin.approve": "Approve",
    "admin.deny": "Deny",
    "admin.participants": "Participants",
    "admin.online": "Online",
    "admin.total": "Total",
    "admin.noPlayers": "No participants yet",
    "admin.stage": "Stage",
    "admin.level": "Lv.",
    "admin.balance": "Balance",
    "admin.itemsCount": "Items",
    "admin.missionsCount": "Missions",
    "admin.deleted": "Deleted",
    "admin.actionLogs": "Action logs",
    "admin.noLogs": "No logs",
    "admin.system": "System",
    "admin.market": "Market",
    "admin.noLots": "No lots",
    "admin.player": "Player",
    "admin.moneyControl": "Money control",
    "admin.amount": "Amount",
    "admin.add": "Add",
    "admin.take": "Take",
    "admin.levelControl": "Level control",
    "admin.levelRange": "Level (1-50)",
    "admin.setLevel": "Set",
    "admin.purchaseHistory": "Purchase history",
    "admin.inventory": "Inventory",
    "admin.empty": "Empty",
    "admin.missions": "Missions",
    "admin.noCompleted": "None completed",
    "admin.block": "Block",
    "admin.delete": "Delete",
    "admin.deleteConfirm": "Delete player",
    "admin.errorTime": "Enter valid time",
    "admin.errorBalance": "Enter valid balance",

    // ItemDetailsDialog
    "item.currentLevel": "Current level",
    "item.efficiency": "Efficiency",
    "item.ecology": "Ecology",
    "item.tierLevel": "Item tier",
    "item.category": "Category",
    "item.basePrice": "Base price",

    // Leaderboard
    "leaderboard.title": "Leaderboard",
    "leaderboard.houseLevel": "House level",
    "leaderboard.points": "points",

    // Events
    "events.title": "Active events",

    // Notifications
    "notif.title": "Notifications",
    "notif.clear": "Clear",
    "notif.empty": "No notifications",
    "notif.secondsAgo": "s ago",
    "notif.minutesAgo": "m ago",
    "notif.hoursAgo": "h ago",

    // PurchaseHistory
    "history.title": "Purchase history",
    "history.loading": "Loading...",
    "history.empty": "No purchases yet",
    "history.level": "Level",

    // WelcomeModal
    "welcome.title": "Welcome to Eco Home!",
    "welcome.creators": "Created by:",
    "welcome.collaboration": "For collaboration and website creation:",

    // Footer
    "footer.developer": "Developer",

    // Rules
    "rules.title": "Game Rules «Eco Home»",
    "rules.fullTitle": "RULES / ПРАВИЛА / QOIDALAR",
    "rules.objective": "Objective",
    "rules.objectiveDesc": "Create the most eco-friendly home by reaching level 50.",
    "rules.winner": "Winner:",
    "rules.winnerDesc": "The winner is the one who reached the maximum house level and saved the most money!",
    "rules.howToPlay": "How to Play",
    "rules.step1": "Choose a card — Energy, Water, or Greenery",
    "rules.step2": "Buy items in the shop for your category",
    "rules.step3": "Level up your house — each purchase increases the level",
    "rules.step4": "Complete missions to earn bonus money",
    "rules.shop": "Shop",
    "rules.shopItems": "30 items in each category (Energy, Water, Greenery)",
    "rules.shopExpensive": "Expensive items give more level and are more eco-friendly",
    "rules.shopUpgrade": "You can upgrade items by buying them again",
    "rules.shopPrice": "Price increases with each item level",
    "rules.market": "Player Market",
    "rules.marketSell": "Sell your items to other players",
    "rules.marketPrice": "Maximum price — 75% of base cost",
    "rules.marketFee": "Market fee — 7%",
    "rules.marketLimit": "Maximum 5 listings per category",
    "rules.bonuses": "Bonuses and Rewards",
    "rules.missions": "Missions — complete tasks for money",
    "rules.treasures": "Treasures — 4 hidden treasures (+$5,000 each)",
    "rules.allTreasures": "All treasures bonus — +$20,000",
    "rules.itemRewards": "Item rewards — bonuses for 50, 75, 100 items",
    "rules.tips": "Tips",
    "rules.tip1": "💡 Choose more eco-friendly items — they're more effective",
    "rules.tip2": "💡 Watch your balance — don't spend everything at once",
    "rules.tip3": "💡 Complete missions for extra income",
    "rules.tip4": "💡 Use the market for profitable deals",
    "rules.goodLuck": "Good luck building your eco home! 🌿🏠",
    "rules.fullText": "See rules above in all 3 languages.",
  },
  uz: {
    // App
    "app.title": "Eko Uy",
    "app.subtitle": "Eng ekologik uyni yarating!",

    // Login
    "login.join": "O'yinga qo'shilish",
    "login.joinDesc": "6 raqamli o'yin kodi va taxallusni kiriting",
    "login.code": "O'yin kodi (6 raqam)",
    "login.nickname": "Taxallusingiz",
    "login.start": "O'yinni boshlash",
    "login.loading": "Yuklanmoqda...",
    "login.createAdmin": "O'yin yaratish (admin)",
    "login.adminTitle": "Admin kirishi",
    "login.adminDesc": "O'yinni boshqarish uchun kiring",
    "login.login": "Login",
    "login.password": "Parol",
    "login.enter": "Kirish",
    "login.back": "Orqaga",
    "login.gameControl": "O'yinni boshqarish",
    "login.selectAction": "Amalni tanlang",
    "login.createRoom": "Yangi xona yaratish",
    "login.joinExisting": "Mavjud xonaga qo'shilish",
    "login.createRoomDesc": "Yangi o'yin xonasini yaratish",
    "login.initialBalance": "O'yinchilarning boshlang'ich balansi ($)",
    "login.creating": "Yaratilmoqda...",
    "login.roomCode": "Xona kodi (6 raqam)",
    "login.joining": "Yuklanmoqda...",
    "login.joinRoom": "Qo'shilish",
    "login.acceptRules": "O'yin qoidalarini qabul qilish kerak",
    "login.acceptRulesText": "Men o'yin qoidalarini o'qidim va qabul qilaman.",
    "login.readRules": "Qoidalarni o'qish",
    "login.waitingApproval": "Tasdiqlash kutilmoqda",
    "login.waitingDesc": "Administrator kirishingizni tasdiqlashi kerak. Iltimos, kuting...",
    "login.denied": "Arizangiz administrator tomonidan rad etildi",
    "login.blocked": "Siz bu o'yinda bloklangansiz",
    "login.reconnected": "Sessiya tiklandi! Progressingiz saqlandi.",
    "login.defaultLanguage": "Standart til",

    // Errors
    "error.title": "Xato",
    "error.fillFields": "Barcha maydonlarni to'ldiring",
    "error.codeFormat": "Kod 6 raqamdan iborat bo'lishi kerak",
    "error.gameNotFound": "Bu kodli o'yin topilmadi",
    "error.gameStarted": "O'yin allaqachon boshlangan. Qo'shilish mumkin emas.",
    "error.nicknameTaken": "Bu taxallus band",
    "error.createPlayer": "O'yinchini yaratib bo'lmadi",
    "error.wrongCredentials": "Noto'g'ri login yoki parol",
    "error.createGame": "O'yinni yaratib bo'lmadi",
    "error.invalidBalance": "To'g'ri boshlang'ich balansni kiriting",
    "error.invalidCode": "To'g'ri 6 raqamli kodni kiriting",

    // Success
    "success.title": "Muvaffaqiyatli!",
    "success.welcome": "Xush kelibsiz",
    "success.welcomeAdmin": "Xush kelibsiz, administrator",
    "success.gameCreated": "O'yin yaratildi!",
    "success.gameCode": "O'yin kodi",
    "success.joinedGame": "O'yinga qo'shildingiz",

    // Nav
    "nav.home": "Uy",
    "nav.shop": "Do'kon",
    "nav.cards": "Kartalar",
    "nav.market": "Bozor",
    "nav.missions": "Vazifalar",
    "nav.history": "Tarix",
    "nav.level": "Dar.",
    "nav.maxLevel": "Maks",
    "nav.exitRoom": "Xonadan chiqish",
    "nav.stage2": "2-bosqich",

    // Exit
    "exit.title": "Xonadan chiqasizmi?",
    "exit.message": "Haqiqatan ham chiqmoqchimisiz? Jarayoningiz yo'qoladi.",
    "exit.cancel": "Bekor qilish",
    "exit.confirm": "Chiqish",

    // Categories
    "category.energy": "Energiya",
    "category.water": "Suv",
    "category.greenery": "Ko'katlar",
    "category.oxygen": "Kislorod",

    // Tiers
    "tier.1": "Oddiy",
    "tier.2": "Yaxshilangan",
    "tier.3": "Ilg'or",
    "tier.4": "Professional",
    "tier.5": "Elita",
    "tier.6": "Afsonaviy",

    // HomeTab
    "home.title": "Sizning Eko Uyingiz",
    "home.titleStage2": "🏰 Sizning Eko Saroyingiz",
    "home.level": "Daraja",
    "home.waterPressure": "Suv bosimi",
    "home.electricity": "Elektr energiyasi",
    "home.buyItems": "Do'kondan narsalar sotib oling!",
    "home.pendingRewards": "📦 Kutilayotgan mukofotlar",
    "home.pendingRewardsDesc": "Mukofotlarni olish uchun inventardan joy bo'shating",
    "home.itemLevel": "Dar.",

    // ShopTab
    "shop.selectCard": "Kartani tanlang",
    "shop.selectCardDesc": "Do'konga kirish uchun avval \"Kartalar\" bo'limidan karta tanlang",
    "shop.title": "Do'kon",
    "shop.category": "Kategoriya",
    "shop.inventory": "Inventar",
    "shop.inventoryFull": "Inventar to'ldi!",
    "shop.inventoryFullDesc": "⚠️ Inventar to'ldi! Yangi narsa olish uchun bozorda soting.",
    "shop.inventoryFullToast": "Inventar to'ldi! Bozorda narsa soting.",
    "shop.stage2Locked": "2-bosqichda oddiy narsalar mavjud emas",
    "shop.notEnough": "Mablag' yetarli emas!",
    "shop.upgrade": "Yaxshilash",
    "shop.buy": "Sotib olish",
    "shop.tier": "Daraja",
    "shop.stage1": "1-bosqich",

    // CardsTab
    "cards.title": "Kategoriyani tanlang",
    "cards.desc": "Do'konni ochish uchun karta tanlang",
    "cards.selected": "Tanlangan",
    "cards.selectedCard": "Tanlangan karta",
    "cards.energyDesc": "Quyosh panellari, shamol generatorlari va boshqa energiya manbalari",
    "cards.waterDesc": "Yomg'ir suvini yig'ish va filtrlash tizimlari",
    "cards.greeneryDesc": "Ekologiya uchun daraxtlar, butalar va o'simliklar",

    // MarketTab
    "market.selectCard": "Kartani tanlang",
    "market.selectCardDesc": "Bozorga kirish uchun avval kartani tanlang",
    "market.title": "Bozor",
    "market.subtitle": "Sotib oling va soting • Komissiya: 7%",
    "market.sellToPlayers": "O'yinchilarga sotish",
    "market.listOnMarket": "Bozorga qo'yish",
    "market.noItems": "Narsalar yo'q",
    "market.level": "Daraja",
    "market.max": "Maks",
    "market.basePrice": "Asosiy",
    "market.maxDiscount": "Maks (-25%)",
    "market.yourPrice": "Sizning narxingiz",
    "market.exceedsLimit": "Limitdan oshdi!",
    "market.back": "Orqaga",
    "market.listFor": "Qo'yish",
    "market.sellToBot": "Botga sotish (50%)",
    "market.sellToBotTitle": "Botga sotish",
    "market.sellToBotDesc": "1-bosqich narsalarini 50% narxda sotish. Pul darhol tushadi.",
    "market.lots": "lot",
    "market.noLots": "Lotlar yo'q",
    "market.sold": "Sotildi",
    "market.from": "dan",
    "market.remove": "Olib tashlash",
    "market.buy": "Sotib olish",

    // MissionsPanel
    "missions.title": "Vazifalar",
    "missions.alreadyDone": "Vazifa allaqachon bajarilgan",
    "missions.gameNotActive": "O'yin faol emas",
    "missions.reward": "Mukofot",
    "missions.claim": "Olish",

    // Mission titles
    "mission.house_3.title": "Birinchi qadam",
    "mission.house_3.desc": "Uyni 3-darajaga yetkazish",
    "mission.house_5.title": "Boshlang'ich rivojlanish",
    "mission.house_5.desc": "Uyni 5-darajaga yetkazish",
    "mission.house_8.title": "Ishonchli o'sish",
    "mission.house_8.desc": "Uyni 8-darajaga yetkazish",
    "mission.house_10.title": "Tajribali quruvchi",
    "mission.house_10.desc": "Uyni 10-darajaga yetkazish",
    "mission.house_15.title": "Usta quruvchi",
    "mission.house_15.desc": "Uyni 15-darajaga yetkazish",
    "mission.house_20.title": "Ekspert quruvchi",
    "mission.house_20.desc": "Uyni 20-darajaga yetkazish",
    "mission.max_level.title": "Maksimal rivojlanish",
    "mission.max_level.desc": "Uyning eng yuqori darajasiga (25) yetish",
    "mission.money_30k.title": "Birinchi kapital",
    "mission.money_30k.desc": "$30,000 to'plash",
    "mission.money_75k.title": "O'suvchi jamg'arma",
    "mission.money_75k.desc": "$75,000 to'plash",
    "mission.money_150k.title": "Mustahkam kapital",
    "mission.money_150k.desc": "$150,000 to'plash",
    "mission.items_3.title": "Birinchi xaridlar",
    "mission.items_3.desc": "3 ta narsa to'plash",
    "mission.items_5.title": "Boshlang'ich kolleksioner",
    "mission.items_5.desc": "5 ta narsa to'plash",
    "mission.items_10.title": "Kolleksioner",
    "mission.items_10.desc": "10 ta narsa to'plash",
    "mission.items_15.title": "Tajribali kolleksioner",
    "mission.items_15.desc": "15 ta narsa to'plash",
    "mission.items_20.title": "Ilg'or kolleksioner",
    "mission.items_20.desc": "20 ta narsa to'plash",
    "mission.items_30.title": "Usta kolleksioner",
    "mission.items_30.desc": "30 ta narsa to'plash",
    "mission.all_categories.title": "Ko'p tomonlama",
    "mission.all_categories.desc": "3 kategoriyadan narsa sotib olish",
    "mission.energy_5.title": "Energetik",
    "mission.energy_5.desc": "5 ta Energiya narsasini sotib olish",
    "mission.water_5.title": "Suv ustasi",
    "mission.water_5.desc": "5 ta Suv narsasini sotib olish",
    "mission.greenery_5.title": "Yashil do'st",
    "mission.greenery_5.desc": "5 ta Ko'katlar narsasini sotib olish",
    "mission.energy_10.title": "Energiya magnati",
    "mission.energy_10.desc": "10 ta Energiya narsasini sotib olish",
    "mission.water_10.title": "Suv hukmdori",
    "mission.water_10.desc": "10 ta Suv narsasini sotib olish",
    "mission.greenery_10.title": "Tabiat himoyachisi",
    "mission.greenery_10.desc": "10 ta Ko'katlar narsasini sotib olish",
    "mission.oxygen_15.title": "Birinchi nafas",
    "mission.oxygen_15.desc": "15 birlik kislorodga yetish",
    "mission.oxygen_30.title": "Toza havo",
    "mission.oxygen_30.desc": "30 birlik kislorodga yetish",
    "mission.oxygen_60.title": "Chuqur nafas",
    "mission.oxygen_60.desc": "60 birlik kislorodga yetish",
    "mission.oxygen_100.title": "Sof havo",
    "mission.oxygen_100.desc": "100 birlik kislorodga yetish",
    "mission.oxygen_150.title": "Kislorod jannati",
    "mission.oxygen_150.desc": "150 birlik kislorodga yetish",

    // AdminPanel
    "admin.title": "Admin Paneli",
    "admin.back": "Orqaga",
    "admin.finish": "Tugatish",
    "admin.pause": "Pauza",
    "admin.resume": "Davom ettirish",
    "admin.gameCode": "O'yin kodi",
    "admin.linkCopied": "Havola nusxalandi!",
    "admin.waiting": "Kutilmoqda",
    "admin.timeLeft": "Qoldi",
    "admin.paused": "Pauza",
    "admin.finished": "O'yin tugadi",
    "admin.startGame": "O'yinni boshlash",
    "admin.gameTime": "O'yin vaqti (daqiqa)",
    "admin.startBalance": "Boshlang'ich balans ($)",
    "admin.start": "O'yinni boshlash",
    "admin.restart": "Qaytadan boshlash",
    "admin.pendingEntries": "Kirish arizalari",
    "admin.approve": "Qabul qilish",
    "admin.deny": "Rad etish",
    "admin.participants": "Ishtirokchilar",
    "admin.online": "Onlayn",
    "admin.total": "Jami",
    "admin.noPlayers": "Hali ishtirokchilar yo'q",
    "admin.stage": "Bosqich",
    "admin.level": "Dar.",
    "admin.balance": "Balans",
    "admin.itemsCount": "Narsalar",
    "admin.missionsCount": "Vazifalar",
    "admin.deleted": "O'chirilganlar",
    "admin.actionLogs": "Harakatlar logi",
    "admin.noLogs": "Loglar yo'q",
    "admin.system": "Tizim",
    "admin.market": "Bozor",
    "admin.noLots": "Lotlar yo'q",
    "admin.player": "O'yinchi",
    "admin.moneyControl": "Pul boshqaruvi",
    "admin.amount": "Miqdor",
    "admin.add": "Qo'shish",
    "admin.take": "Olish",
    "admin.levelControl": "Daraja boshqaruvi",
    "admin.levelRange": "Daraja (1-50)",
    "admin.setLevel": "O'rnatish",
    "admin.purchaseHistory": "Xaridlar tarixi",
    "admin.inventory": "Inventar",
    "admin.empty": "Bo'sh",
    "admin.missions": "Vazifalar",
    "admin.noCompleted": "Bajarilganlar yo'q",
    "admin.block": "Bloklash",
    "admin.delete": "O'chirish",
    "admin.deleteConfirm": "O'yinchini o'chirish",
    "admin.errorTime": "To'g'ri vaqtni kiriting",
    "admin.errorBalance": "To'g'ri balansni kiriting",

    // ItemDetailsDialog
    "item.currentLevel": "Joriy daraja",
    "item.efficiency": "Samaradorlik",
    "item.ecology": "Ekologiklik",
    "item.tierLevel": "Narsa darajasi",
    "item.category": "Kategoriya",
    "item.basePrice": "Asosiy narx",

    // Leaderboard
    "leaderboard.title": "Peshqadamlar jadvali",
    "leaderboard.houseLevel": "Uy darajasi",
    "leaderboard.points": "ball",

    // Events
    "events.title": "Faol hodisalar",

    // Notifications
    "notif.title": "Bildirishnomalar",
    "notif.clear": "Tozalash",
    "notif.empty": "Bildirishnomalar yo'q",
    "notif.secondsAgo": "s oldin",
    "notif.minutesAgo": "d oldin",
    "notif.hoursAgo": "s oldin",

    // PurchaseHistory
    "history.title": "Xaridlar tarixi",
    "history.loading": "Yuklanmoqda...",
    "history.empty": "Hali xaridlar yo'q",
    "history.level": "Daraja",

    // WelcomeModal
    "welcome.title": "Eco Home ga xush kelibsiz!",
    "welcome.creators": "Sayt yaratuvchilari:",
    "welcome.collaboration": "Hamkorlik va sayt yaratish bo'yicha:",

    // Footer
    "footer.developer": "Dasturchi",

    // Rules
    "rules.title": "«Eko Uy» o'yin qoidalari",
    "rules.fullTitle": "QOIDALAR / ПРАВИЛА / RULES",
    "rules.objective": "Maqsad",
    "rules.objectiveDesc": "50-darajaga yetib, eng ekologik uyni yarating.",
    "rules.winner": "G'olib:",
    "rules.winnerDesc": "Eng yuqori uy darajasiga yetgan va eng ko'p pul saqlab qolgan g'olib bo'ladi!",
    "rules.howToPlay": "Qanday o'ynash kerak",
    "rules.step1": "Kartani tanlang — Energiya, Suv yoki Ko'katlar",
    "rules.step2": "Tanlangan kategoriya uchun do'kondan narsalar sotib oling",
    "rules.step3": "Uy darajasini oshiring — har bir xarid darajani oshiradi",
    "rules.step4": "Bonus pul olish uchun vazifalarni bajaring",
    "rules.shop": "Do'kon",
    "rules.shopItems": "Har bir kategoriyada 30 ta narsa",
    "rules.shopExpensive": "Qimmat narsalar ko'proq daraja beradi",
    "rules.shopUpgrade": "Narsalarni qayta sotib olib yaxshilash mumkin",
    "rules.shopPrice": "Narx har bir daraja bilan oshadi",
    "rules.market": "O'yinchilar bozori",
    "rules.marketSell": "Narsalaringizni boshqa o'yinchilarga soting",
    "rules.marketPrice": "Maksimal narx — asosiy qiymatning 75%",
    "rules.marketFee": "Bozor komissiyasi — 7%",
    "rules.marketLimit": "Har bir kategoriyada maksimum 5 ta e'lon",
    "rules.bonuses": "Bonuslar va mukofotlar",
    "rules.missions": "Vazifalar — pul uchun vazifalarni bajaring",
    "rules.treasures": "Xazinalar — 4 ta yashirin xazina (har biri +$5,000)",
    "rules.allTreasures": "Barcha xazinalar bonusi — +$20,000",
    "rules.itemRewards": "Narsalar uchun mukofotlar — 50, 75, 100 narsa uchun bonuslar",
    "rules.tips": "Maslahatlar",
    "rules.tip1": "💡 Ekologikroq narsalarni tanlang",
    "rules.tip2": "💡 Balansga e'tibor bering",
    "rules.tip3": "💡 Qo'shimcha daromad uchun vazifalarni bajaring",
    "rules.tip4": "💡 Foydali bitimlar uchun bozordan foydalaning",
    "rules.goodLuck": "Ekologik uy qurishda omad! 🌿🏠",
    "rules.fullText": "Yuqoridagi qoidalarni 3 tilda ko'ring.",
  },
};
