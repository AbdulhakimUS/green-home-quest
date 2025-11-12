export const Footer = () => {
  return (
    <footer className="w-full py-4 px-4 bg-card border-t border-border mt-auto">
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <a 
          href="https://t.me/amonovvv_a" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          developer: @amonovvv_a
        </a>
        <span className="hidden sm:inline">|</span>
        <a 
          href="https://t.me/Prosto_chel999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          creator: @Prosto_chel999
        </a>
        <span className="hidden sm:inline">|</span>
        <a 
          href="https://t.me/abdusatorovv_a" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          designer: @abdusatorovv_a
        </a>
      </div>
    </footer>
  );
};
