import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ru" | "en" | "uz";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ru: {
    "app.title": "Эко Дом",
    "app.subtitle": "Создайте самый экологичный дом!",
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
    "success.title": "Успешно!",
    "success.welcome": "Добро пожаловать",
    "success.welcomeAdmin": "Добро пожаловать, администратор",
    "success.gameCreated": "Игра создана!",
    "success.gameCode": "Код игры",
    "success.joinedGame": "Присоединились к игре",
    "nav.home": "Дом",
    "nav.shop": "Магазин",
    "nav.cards": "Карты",
    "nav.market": "Рынок",
    "nav.missions": "Миссии",
    "nav.history": "История",
    "nav.level": "Ур.",
    "nav.maxLevel": "Макс",
    "nav.exitRoom": "Выйти из комнаты",
    "exit.title": "Выйти из комнаты?",
    "exit.message": "Вы точно хотите выйти из игры? Ваш прогресс будет потерян.",
    "exit.cancel": "Отмена",
    "exit.confirm": "Выйти",
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

📊 BOSQICHLAR
• 1-bosqich (1-25 daraja): oddiy uy
• 2-bosqich (26-50 daraja): yangi dizayn, 1-3 daraja narsalari bloklanadi
• 2-bosqichda eski narsalarni botga 50% narxda sotish mumkin

⚠️ TAQIQLANADI
• Xatolardan foydalanish
• Narsalarni nusxalash (dup)
• Inventar limitlarini chetlab o'tish
• Qoidabuzarlar admin tomonidan bloklanadi`,
    "footer.developer": "Разработчик",
  },
  en: {
    "app.title": "Eco Home",
    "app.subtitle": "Create the most eco-friendly home!",
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
    "success.title": "Success!",
    "success.welcome": "Welcome",
    "success.welcomeAdmin": "Welcome, administrator",
    "success.gameCreated": "Game created!",
    "success.gameCode": "Game code",
    "success.joinedGame": "Joined game",
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.cards": "Cards",
    "nav.market": "Market",
    "nav.missions": "Missions",
    "nav.history": "History",
    "nav.level": "Lv.",
    "nav.maxLevel": "Max",
    "nav.exitRoom": "Exit room",
    "exit.title": "Exit room?",
    "exit.message": "Are you sure you want to exit? Your progress will be lost.",
    "exit.cancel": "Cancel",
    "exit.confirm": "Exit",
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
    "footer.developer": "Developer",
  },
  uz: {
    "app.title": "Eko Uy",
    "app.subtitle": "Eng ekologik uyni yarating!",
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
    "success.title": "Muvaffaqiyatli!",
    "success.welcome": "Xush kelibsiz",
    "success.welcomeAdmin": "Xush kelibsiz, administrator",
    "success.gameCreated": "O'yin yaratildi!",
    "success.gameCode": "O'yin kodi",
    "success.joinedGame": "O'yinga qo'shildingiz",
    "nav.home": "Uy",
    "nav.shop": "Do'kon",
    "nav.cards": "Kartalar",
    "nav.market": "Bozor",
    "nav.missions": "Vazifalar",
    "nav.history": "Tarix",
    "nav.level": "Dar.",
    "nav.maxLevel": "Maks",
    "nav.exitRoom": "Xonadan chiqish",
    "exit.title": "Xonadan chiqasizmi?",
    "exit.message": "Haqiqatan ham chiqmoqchimisiz? Jarayoningiz yo'qoladi.",
    "exit.cancel": "Bekor qilish",
    "exit.confirm": "Chiqish",
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
    "footer.developer": "Dasturchi",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("eco_home_language");
    return (saved as Language) || "ru";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("eco_home_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["ru"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
