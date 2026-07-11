import { useEffect, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  triggerRef: RefObject<HTMLElement | null>;
  title: string;
  subtitle?: string;
  price?: string | null;
  image?: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function StickyBuyBar({
  triggerRef,
  title,
  subtitle,
  price,
  image,
  onAddToCart,
  onBuyNow,
  disabled,
  loading,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="hidden lg:block fixed top-16 left-0 right-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl"
        >
          <div className="container-premium h-16 flex items-center gap-4">
            {image && (
              <img src={image} alt="" className="h-10 w-10 object-cover bg-surface" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{title}</div>
              {subtitle && (
                <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
              )}
            </div>
            {price && <div className="text-base font-bold whitespace-nowrap">{price}</div>}
            <Button
              onClick={onAddToCart}
              disabled={disabled || loading}
              variant="outline"
              size="sm"
              className="rounded-none uppercase tracking-wider text-[10px] h-10"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />}
              Carrinho
            </Button>
            <Button
              onClick={onBuyNow}
              disabled={disabled || loading}
              size="sm"
              className="rounded-none uppercase tracking-wider text-[10px] h-10 bg-primary hover:bg-primary/90"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 mr-1.5" />}
              Comprar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
