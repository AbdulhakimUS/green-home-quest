# Инструкция по настройке автоматической очистки данных

## 1. SQL функция для очистки (УЖЕ СОЗДАНА)
Функция `cleanup_old_game_data()` уже создана в вашей базе данных.

## 2. Настройка автоматической очистки через Supabase Cron

### Шаг 1: Включите расширение pg_cron
Выполните в SQL Editor вашего Supabase проекта:

```sql
-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Шаг 2: Настройте cron job для ежедневной очистки
Выполните следующий SQL:

```sql
-- Настраиваем cron job для ежедневной очистки в 3:00 AM
SELECT cron.schedule(
  'cleanup-old-games',
  '0 3 * * *',
  $$SELECT cleanup_old_game_data()$$
);
```

### Шаг 3: Проверка работы cron job
Посмотреть список активных cron jobs:

```sql
SELECT * FROM cron.job;
```

Посмотреть историю выполнения:

```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### Шаг 4: Ручной запуск очистки (опционально)
Если хотите запустить очистку вручную прямо сейчас:

```sql
SELECT * FROM cleanup_old_game_data();
```

## Альтернатива: Вызов через Edge Function (если pg_cron недоступен)

Если pg_cron недоступен в вашем тарифе Supabase, можно использовать внешний cron сервис (например, cron-job.org) для вызова Edge Function:

1. Создайте Edge Function `cleanup-old-data`:
```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { data, error } = await supabase.rpc('cleanup_old_game_data')
  
  return new Response(JSON.stringify({ success: !error, data }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

2. Настройте внешний cron для вызова этой функции ежедневно.

## Примечания
- Все данные старше 24 часов удаляются автоматически
- Админские аккаунты не затрагиваются (они в коде, а не в БД)
- Каскадное удаление: сессии → игроки → история покупок
