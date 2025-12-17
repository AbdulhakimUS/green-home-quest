import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-card border-t border-border">
      <div className="flex justify-center text-xs sm:text-sm text-muted-foreground">
        <span>{t("footer.developer")}: <a href="https://t.me/amonovvv_a" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@amonovvv_a</a></span>
      </div>
    </footer>
  );
};
