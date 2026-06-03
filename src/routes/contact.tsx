import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Instagram } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto — APEX Automotive" },
      { name: "description", content: "Fala connosco. Email, WhatsApp e redes sociais para esclarecer qualquer dúvida sobre os nossos volantes premium." },
      { property: "og:title", content: "Contacto — APEX Automotive" },
      { property: "og:description", content: "Estamos disponíveis para te ajudar a personalizar o teu próximo volante." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container-premium py-16 md:py-24 max-w-5xl">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Fala connosco</div>
      <h1 className="text-5xl md:text-6xl font-bold mb-4">Contacto</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mb-16">
        Tens dúvidas sobre personalização, compatibilidade ou entrega? Responde-nos e voltamos a ti em menos de 24h.
      </p>

      <div className="grid md:grid-cols-3 gap-px bg-border">
        {[
          { icon: Mail, t: "Email", v: "hello@apex-automotive.com", href: "mailto:hello@apex-automotive.com" },
          { icon: MessageCircle, t: "WhatsApp", v: "+351 900 000 000", href: "https://wa.me/351900000000" },
          { icon: Instagram, t: "Instagram", v: "@apex.automotive", href: "https://instagram.com" },
        ].map(({ icon: Icon, t, v, href }) => (
          <a key={t} href={href} className="bg-surface p-10 hover:bg-surface-elevated transition-colors block">
            <Icon className="h-6 w-6 text-primary mb-4" />
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t}</div>
            <div className="font-semibold">{v}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
