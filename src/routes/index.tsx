import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import heroBurger from "@/assets/hero-burger.jpg";
import fries from "@/assets/fries.jpg";
import wings from "@/assets/wings.jpg";
import mojito from "@/assets/mojito.jpg";
import wrap from "@/assets/wrap.jpg";
import seafood from "@/assets/seafood.jpg";
import ambience from "@/assets/ambience.jpg";
import logo from "@/assets/logo.png";
import periPeriBurger from "@/assets/peri-peri-burger.jpg";
import texMexBurger from "@/assets/tex-mex-burger.jpg";
import koreanWings from "@/assets/korean-wings.jpg";
import oreoShake from "@/assets/oreo-shake.jpg";
import calamari from "@/assets/calamari.jpg";
import bbqFries from "@/assets/bbq-fries.jpg";
import southernBurger from "@/assets/southern-burger.jpg";
import veggieSub from "@/assets/veggie-sub.jpg";
import flamethrowerBurger from "@/assets/flamethrower-burger.jpg";
import classicCheeseburger from "@/assets/classic-cheeseburger.jpg";
import fishBurger from "@/assets/fish-burger.jpg";
import periFries from "@/assets/peri-fries.jpg";
import garlicFries from "@/assets/garlic-fries.jpg";
import nachoFries from "@/assets/nacho-fries.jpg";
import saltedFries from "@/assets/salted-fries.jpg";
import bbqWings from "@/assets/bbq-wings.jpg";
import honeyWings from "@/assets/honey-wings.jpg";
import lemonWings from "@/assets/lemon-wings.jpg";
import texmexWrap from "@/assets/texmex-wrap.jpg";
import periWrap from "@/assets/peri-wrap.jpg";
import chickenSub from "@/assets/chicken-sub.jpg";
import paneerWrap from "@/assets/paneer-wrap.jpg";
import butterPrawns from "@/assets/butter-prawns.jpg";

import prawnTempura from "@/assets/prawn-tempura.jpg";
import nutellaShake from "@/assets/nutella-shake.jpg";
import strawberryShake from "@/assets/strawberry-shake.jpg";
import coldCoffee from "@/assets/cold-coffee.jpg";
import watermelonCooler from "@/assets/watermelon-cooler.jpg";
import blueLagoon from "@/assets/blue-lagoon.jpg";

const PHONE = "918600207544";
const CALL_LINK = `tel:+${PHONE}`;

function scrollToHash(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }
}

type CartItem = { name: string; price: number; img: string; qty: number };
type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (i: { name: string; price: string; img: string }) => void;
  inc: (name: string) => void;
  dec: (name: string) => void;
  remove: (name: string) => void;
  open: () => void;
  isOpen: boolean;
  setOpen: (o: boolean) => void;
};
const CartContext = createContext<CartCtx | null>(null);
const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("CartContext missing");
  return c;
};
const parsePrice = (p: string) => Number(p.replace(/[^\d.]/g, "")) || 0;

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const add: CartCtx["add"] = (i) => {
    const price = parsePrice(i.price);
    setItems((prev) => {
      const ex = prev.find((p) => p.name === i.name);
      if (ex) return prev.map((p) => (p.name === i.name ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { name: i.name, price, img: i.img, qty: 1 }];
    });
    setOpen(true);
  };
  const inc = (name: string) =>
    setItems((p) => p.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (name: string) =>
    setItems((p) =>
      p.map((i) => (i.name === name ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0),
    );
  const remove = (name: string) => setItems((p) => p.filter((i) => i.name !== name));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const value = useMemo(
    () => ({
      items,
      count,
      total,
      add,
      inc,
      dec,
      remove,
      open: () => setOpen(true),
      isOpen,
      setOpen,
    }),
    [items, isOpen],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function AddToCartButton({
  item,
  className,
  label = "Add to Cart",
}: {
  item: { name: string; price: string; img: string };
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => add(item)}
      className={
        className ??
        "mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
      }
    >
      <Plus className="size-4" /> {label}
    </button>
  );
}

function CartDrawer() {
  const { items, count, total, inc, dec, remove, isOpen, setOpen } = useCart();
  const checkoutUrl = useMemo(() => {
    if (items.length === 0) return "#";
    const lines = items.map((i) => `- ${i.name} x ${i.qty} = ₹${i.qty * i.price}`).join("\n");
    const text = `Hi Grub Monkeys, I want to place an order:\n${lines}\nTotal: ₹${total}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  }, [items, total]);
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open cart"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-flame hover:scale-105 transition cursor-pointer"
        >
          <ShoppingCart className="size-5" />
          <span className="font-semibold">{count}</span>
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-display text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-2 px-2 mt-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">
              Cart is empty. Add some flame 🔥
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={i.name}
                  className="flex gap-3 rounded-2xl border border-border p-3 bg-card/50"
                >
                  <img
                    src={i.img}
                    alt={i.name}
                    className="size-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm leading-tight">{i.name}</h4>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => remove(i.name)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="text-primary text-sm font-semibold mt-1">
                      ₹{i.price * i.qty}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => dec(i.name)}
                        className="size-7 rounded-full border border-border flex items-center justify-center hover:bg-card cursor-pointer"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{i.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => inc(i.name)}
                        className="size-7 rounded-full border border-border flex items-center justify-center hover:bg-card cursor-pointer"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border pt-4 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-display text-2xl text-primary">₹{total}</span>
            </div>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground shadow-flame hover:scale-[1.01] transition cursor-pointer"
            >
              Order on WhatsApp →
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grub Monkeys — Mangalore's Ultimate Burger & Loaded Fries" },
      {
        name: "description",
        content:
          "Crazy burgers, loaded fries, wings, wraps & monster shakes — now open at Falnir, Mangalore. Built for people who eat with both hands.",
      },
      { property: "og:title", content: "Grub Monkeys — Falnir, Mangalore" },
      { property: "og:description", content: "Loaded burgers, crazy fries, wings, shakes." },
      { property: "og:image", content: heroBurger },
    ],
  }),
  component: Index,
});

function Marquee() {
  const text =
    "🔥 NOW OPEN AT FALNIR 🍔  ★  LOADED BURGERS • CRAZY FRIES • WINGS • SHAKES  ★  📍 FALNIR MAIN RD, MANGALORE  ★  ";
  return (
    <div className="overflow-hidden bg-primary text-primary-foreground py-2 border-y border-primary-foreground/10">
      <div className="marquee-track whitespace-nowrap text-marquee text-sm md:text-base font-semibold">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="px-6">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4">
      <div className="flex items-center justify-between rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 shadow-flame">
        <a href="#" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Grub Monkeys"
            width={40}
            height={40}
            className="size-10 rounded-full bg-primary p-1"
          />
          <div className="leading-tight">
            <div className="text-display text-lg tracking-wider">GRUB MONKEYS</div>
            <div className="text-[10px] text-muted-foreground tracking-[0.2em]">
              FALNIR · MANGALORE
            </div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <a href="#home" className="hover:text-primary transition">
            Home
          </a>
          <a href="#menu" className="hover:text-primary transition">
            Menu
          </a>
          <a href="#story" className="hover:text-primary transition">
            Story
          </a>
          <a href="#find" className="hover:text-primary transition">
            Find Us
          </a>
        </nav>
        <a
          href="#menu"
          onClick={(e) => scrollToHash(e, "menu")}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Order →
        </a>
      </div>
    </header>
  );
}

const HERO_SLIDES = [
  { src: heroBurger, alt: "Loaded double cheese burger" },
  { src: flamethrowerBurger, alt: "Flamethrower burger" },
  { src: koreanWings, alt: "Korean wings" },
  { src: bbqFries, alt: "BBQ loaded fries" },
  { src: texMexBurger, alt: "Tex-Mex burger" },
  { src: oreoShake, alt: "Oreo monster shake" },
  { src: periWrap, alt: "Peri peri wrap" },
  { src: calamari, alt: "Crispy calamari" },
];

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <section id="home" className="relative overflow-hidden bg-hero min-h-[88vh] flex items-center">
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1536}
            height={1536}
            className={`absolute right-[-10%] top-1/2 -translate-y-1/2 h-[110%] w-auto object-contain select-none transition-opacity duration-1000 ${i === slide ? "opacity-90" : "opacity-0"}`}
          />
        ))}
      </div>
      <div className="absolute inset-0 md:hidden pointer-events-none">
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={`absolute inset-0 h-full w-full object-cover select-none transition-opacity duration-1000 ${i === slide ? "opacity-40" : "opacity-0"}`}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/40" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 w-full">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary tracking-widest">
          <span className="size-2 rounded-full bg-primary animate-pulse" /> NOW OPEN AT FALNIR
        </span>
        <h1 className="mt-6 text-display text-6xl md:text-8xl leading-[0.9] max-w-4xl">
          MANGALORE'S
          <br />
          <span className="text-primary">ULTIMATE</span> BURGER
          <br />
          & LOADED FRIES
          <br />
          DESTINATION
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Crazy burgers, loaded fries, wings, wraps & monster shakes — built for people who eat with
          both hands.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={CALL_LINK}
            className="rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-flame hover:scale-105 transition"
          >
            Reserve Table
          </a>
          <a
            href="#menu"
            onClick={(e) => scrollToHash(e, "menu")}
            className="rounded-full border border-border bg-card/60 px-7 py-3.5 text-base font-semibold hover:bg-card transition"
          >
            Order Online →
          </a>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg border-t border-border pt-6">
          {[
            ["4.7★", "Google rating"],
            ["50K+", "Burgers served"],
            ["30 min", "Avg. delivery"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-display text-3xl text-primary">{k}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Item = { name: string; cat: string; price: string; desc: string; img: string };
const featured: Item[] = [
  {
    name: "The Carnivore",
    cat: "Signature Burger",
    price: "₹319",
    desc: "Double patty, chicken, cheddar, smoke.",
    img: heroBurger,
  },
  {
    name: "Cheese Chipotle Fries",
    cat: "Loaded Fries",
    price: "₹179",
    desc: "Skin-on fries drowned in cheddar.",
    img: fries,
  },
  {
    name: "Buffalo Wings",
    cat: "Wings",
    price: "₹229",
    desc: "Crispy, sticky, glazed in fire.",
    img: wings,
  },
  {
    name: "Virgin Mojito",
    cat: "Drinks",
    price: "₹129",
    desc: "Lime, mint, fizz. Done right.",
    img: mojito,
  },
  {
    name: "Spicy Pulled Chicken Wrap",
    cat: "Wraps",
    price: "₹199",
    desc: "Slow-pulled chicken, hot sauce.",
    img: wrap,
  },
  {
    name: "Fish & Chips",
    cat: "Seafood",
    price: "₹289",
    desc: "Crispy beer-battered, lemon mayo.",
    img: seafood,
  },
];

function Featured() {
  return (
    <section id="featured" className="relative py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="text-xs text-primary tracking-[0.3em] mb-3">FEATURED</div>
            <h2 className="text-display text-5xl md:text-7xl">The hall of flame.</h2>
          </div>
          <a
            href="#menu"
            onClick={(e) => scrollToHash(e, "menu")}
            className="text-sm font-semibold border-b border-primary text-primary pb-1"
          >
            See full menu →
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((item) => (
            <article
              key={item.name}
              className="group rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/60 transition"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <div className="text-[10px] text-primary tracking-[0.25em] mb-2">
                  {item.cat.toUpperCase()}
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-display text-2xl">{item.name}</h3>
                  <span className="text-display text-xl text-primary">{item.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                <AddToCartButton item={item} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type MenuItem = { name: string; price: string; desc: string; img: string };
const menuByCategory: Record<string, { hero: string; items: MenuItem[] }> = {
  Burgers: {
    hero: heroBurger,
    items: [
      {
        name: "Peri Peri Burger",
        price: "₹219",
        desc: "Crispy chicken, peri peri mayo, slaw.",
        img: periPeriBurger,
      },
      {
        name: "Tex Mex Burger",
        price: "₹239",
        desc: "Jalapeños, cheddar, smoky chipotle.",
        img: texMexBurger,
      },
      {
        name: "Flamethrower Chicken",
        price: "₹259",
        desc: "Spice level: dangerous.",
        img: flamethrowerBurger,
      },
      {
        name: "Southern Style",
        price: "₹249",
        desc: "Buttermilk fried chicken, pickles.",
        img: southernBurger,
      },
      {
        name: "The Carnivore",
        price: "₹319",
        desc: "Double patty, chicken, cheddar.",
        img: heroBurger,
      },
      {
        name: "Korean Kong",
        price: "₹279",
        desc: "Gochujang glaze, sesame slaw.",
        img: koreanWings,
      },
      {
        name: "Angry Nemo",
        price: "₹289",
        desc: "Crispy fish fillet, sriracha aioli.",
        img: fishBurger,
      },
      {
        name: "Classic Cheeseburger",
        price: "₹189",
        desc: "Beef patty, american cheese, pickles.",
        img: classicCheeseburger,
      },
      {
        name: "Veggie Crunch Burger",
        price: "₹169",
        desc: "Crispy veg patty, lettuce, cheese.",
        img: veggieSub,
      },
    ],
  },
  "Loaded Fries": {
    hero: fries,
    items: [
      {
        name: "Cheese Chipotle Fries",
        price: "₹179",
        desc: "Skin-on fries drowned in cheddar.",
        img: fries,
      },
      {
        name: "BBQ Pulled Chicken Fries",
        price: "₹229",
        desc: "Smoky BBQ chicken, cheese, jalapeños.",
        img: bbqFries,
      },
      {
        name: "Peri Peri Fries",
        price: "₹169",
        desc: "Tossed in fiery peri peri seasoning.",
        img: periFries,
      },
      {
        name: "Cheesy Garlic Fries",
        price: "₹189",
        desc: "Garlic butter, mozzarella, parsley.",
        img: garlicFries,
      },
      {
        name: "Loaded Nacho Fries",
        price: "₹219",
        desc: "Salsa, jalapeños, sour cream, cheese.",
        img: nachoFries,
      },
      {
        name: "Classic Salted Fries",
        price: "₹119",
        desc: "Crispy skin-on, sea salt.",
        img: saltedFries,
      },
    ],
  },
  Wings: {
    hero: wings,
    items: [
      { name: "Buffalo Wings", price: "₹229", desc: "Crispy, sticky, glazed in fire.", img: wings },
      {
        name: "Korean Gochujang Wings",
        price: "₹249",
        desc: "Sesame, spring onion, sticky glaze.",
        img: koreanWings,
      },
      { name: "Flamethrower Wings", price: "₹259", desc: "Spice level: dangerous.", img: wings },
      {
        name: "BBQ Smoked Wings",
        price: "₹239",
        desc: "Slow-smoked, sticky bbq glaze.",
        img: bbqWings,
      },
      {
        name: "Honey Garlic Wings",
        price: "₹229",
        desc: "Sweet, garlicky, finger-licking.",
        img: honeyWings,
      },
      {
        name: "Lemon Pepper Wings",
        price: "₹219",
        desc: "Zesty, peppery, herb-crusted.",
        img: lemonWings,
      },
    ],
  },
  "Wraps & Subs": {
    hero: wrap,
    items: [
      {
        name: "Spicy Pulled Chicken Wrap",
        price: "₹199",
        desc: "Slow-pulled chicken, hot sauce.",
        img: wrap,
      },
      {
        name: "Tex Mex Chicken Wrap",
        price: "₹209",
        desc: "Beans, salsa, jalapeños, cheese.",
        img: texmexWrap,
      },
      {
        name: "Peri Peri Chicken Wrap",
        price: "₹199",
        desc: "Grilled peri peri chicken, slaw.",
        img: periWrap,
      },
      {
        name: "Grilled Veggie Sub",
        price: "₹179",
        desc: "Charred peppers, onions, cheese.",
        img: veggieSub,
      },
      {
        name: "Crispy Chicken Sub",
        price: "₹229",
        desc: "Toasted bread, fried chicken, mayo.",
        img: chickenSub,
      },
      {
        name: "Paneer Tikka Wrap",
        price: "₹189",
        desc: "Smoky paneer, mint chutney, onions.",
        img: paneerWrap,
      },
    ],
  },
  Seafood: {
    hero: seafood,
    items: [
      {
        name: "Fish & Chips",
        price: "₹289",
        desc: "Crispy beer-battered, lemon mayo.",
        img: seafood,
      },
      {
        name: "Angry Nemo Burger",
        price: "₹289",
        desc: "Crispy fish, sriracha aioli.",
        img: fishBurger,
      },
      {
        name: "Crispy Calamari",
        price: "₹259",
        desc: "Golden rings, spicy aioli, lemon.",
        img: calamari,
      },
      {
        name: "Butter Garlic Prawns",
        price: "₹319",
        desc: "Pan-tossed, garlic, herbs.",
        img: butterPrawns,
      },
      {
        name: "Prawn Tempura Basket",
        price: "₹299",
        desc: "Light batter, served with dip.",
        img: prawnTempura,
      },
    ],
  },
  "Shakes & Drinks": {
    hero: mojito,
    items: [
      { name: "Virgin Mojito", price: "₹129", desc: "Lime, mint, fizz. Done right.", img: mojito },
      {
        name: "Oreo Monster Shake",
        price: "₹199",
        desc: "Whipped cream, cookies, chocolate drip.",
        img: oreoShake,
      },
      {
        name: "Nutella Shake",
        price: "₹209",
        desc: "Hazelnut indulgence, thick and rich.",
        img: nutellaShake,
      },
      {
        name: "Strawberry Shake",
        price: "₹179",
        desc: "Fresh strawberries, vanilla cream.",
        img: strawberryShake,
      },
      {
        name: "Cold Coffee",
        price: "₹149",
        desc: "Espresso, milk, ice, choco drizzle.",
        img: coldCoffee,
      },
      {
        name: "Watermelon Cooler",
        price: "₹119",
        desc: "Fresh watermelon, lime, mint.",
        img: watermelonCooler,
      },
      {
        name: "Blue Lagoon",
        price: "₹139",
        desc: "Citrus, blue curaçao mocktail.",
        img: blueLagoon,
      },
    ],
  },
};

function MenuList() {
  const categories = Object.keys(menuByCategory);
  const [active, setActive] = useState<string>(categories[0]);
  const current = menuByCategory[active];
  return (
    <section id="menu" className="bg-card/40 py-24 px-4 border-y border-border">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <div className="text-xs text-primary tracking-[0.3em] mb-3">THE MENU</div>
          <h2 className="text-display text-5xl md:text-6xl">Pick your poison.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Hand-crafted at Falnir. Made loud, made loaded, served fast.
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${active === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-10 rounded-3xl overflow-hidden border border-border">
            <img
              src={current.hero}
              alt={active}
              loading="lazy"
              className="w-full h-72 object-cover transition"
              key={active}
            />
          </div>
        </div>
        <div>
          <div className="text-xs text-primary tracking-[0.3em] mb-3">CATEGORY</div>
          <h3 className="text-display text-4xl mb-6">{active}</h3>
          <ul className="divide-y divide-border">
            {current.items.map((item, i) => (
              <li
                key={item.name}
                className="py-5 flex items-start gap-5 group hover:bg-card/40 -mx-3 px-3 rounded-xl transition"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="size-20 rounded-xl object-cover shrink-0 border border-border"
                />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-display text-2xl">{item.name}</h4>
                    <span className="text-display text-xl text-primary">{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  <AddToCartButton
                    item={item}
                    label="Add"
                    className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Story() {
  const points = [
    ["🔥", "Premium Ingredients", "Sourced fresh. No shortcuts."],
    ["🍔", "Loaded Portions", "We don't believe in 'small'."],
    ["🌶️", "Signature Sauces", "House-made, slightly addictive."],
    ["🛵", "Fast Delivery", "Hot at your door in ~30 min."],
    ["🎶", "Trendy Ambience", "Neon, beats, good vibes."],
    ["💸", "Affordable Pricing", "Premium taste, street prices."],
  ];
  return (
    <section id="story" className="py-24 px-4">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-3">
          <img
            src={ambience}
            alt="Restaurant ambience"
            loading="lazy"
            className="rounded-3xl aspect-square object-cover col-span-2"
          />
          <img
            src={heroBurger}
            alt="Burger"
            loading="lazy"
            className="rounded-3xl aspect-square object-cover"
          />
          <img
            src={fries}
            alt="Fries"
            loading="lazy"
            className="rounded-3xl aspect-square object-cover"
          />
        </div>
        <div>
          <div className="text-xs text-primary tracking-[0.3em] mb-3">OUR STORY</div>
          <h2 className="text-display text-5xl md:text-6xl leading-[0.95]">
            Born in Mangalore.
            <br />
            Built for cravings.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Grub Monkeys is one of Mangalore's favourite fast-food destinations — known for loaded
            fries, juicy burgers, crispy wings, wraps, seafood specials and monster shakes. Built
            for food lovers who crave bold flavours, indulgent comfort food, and unforgettable
            street-food experiences.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {points.map(([icon, title, desc]) => (
              <div key={title} className="rounded-2xl bg-card border border-border p-4">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-display text-lg">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Feed() {
  const tiles = [
    [heroBurger, "The Carnivore"],
    [fries, "Loaded fries season"],
    [wings, "Buffalo wings night"],
    [mojito, "Cool down"],
    [wrap, "Wrap drop"],
    [seafood, "Catch of the day"],
    [ambience, "Neon vibes only"],
    [heroBurger, "Double stack"],
  ] as const;
  return (
    <section className="py-24 px-4 bg-card/40 border-y border-border">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs text-primary tracking-[0.3em] mb-3">@GRUBMONKEYSMANGALORE</div>
            <h2 className="text-display text-5xl md:text-6xl">The feed.</h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              Daily food drops, behind-the-grill moments, and neon-soaked diner nights.
            </p>
          </div>
          <a
            href="https://www.instagram.com/grubmonkeysmangalore/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold border-b border-primary text-primary pb-1"
          >
            Follow @grubmonkeysmangalore →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map(([img, alt], i) => (
            <a
              key={i}
              href="https://www.instagram.com/grubmonkeysmangalore/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={img}
                alt={alt}
                loading="lazy"
                className="size-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold opacity-0 group-hover:opacity-100 transition flex justify-between">
                <span>{alt}</span>
                <span className="text-primary">IG ↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    ["Best burgers in Mangalore. The Carnivore is unreal.", "Aditi R.", "Foodie · 5★"],
    ["Loaded fries are addictive. I've ordered 3 times this week.", "Rohan M.", "Regular · 5★"],
    ["Perfect late-night food spot — vibe is on another level.", "Sneha P.", "Local · 5★"],
    ["Amazing wings and the monster shakes are legendary.", "Karthik S.", "Foodie · 5★"],
  ];
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs text-primary tracking-[0.3em] mb-3">WORD ON THE STREET</div>
        <h2 className="text-display text-5xl md:text-6xl mb-12">People aren't subtle.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map(([q, name, role]) => (
            <figure key={name} className="rounded-3xl border border-border bg-card p-6">
              <div className="text-display text-5xl text-primary leading-none mb-2">"</div>
              <blockquote className="text-base">{q}</blockquote>
              <figcaption className="mt-5 pt-4 border-t border-border">
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FindUs() {
  return (
    <section id="find" className="py-24 px-4 bg-hero border-t border-border">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12">
        <div>
          <div className="text-xs text-primary tracking-[0.3em] mb-3">FIND US</div>
          <h2 className="text-display text-5xl md:text-6xl">Pull up to Bendoor.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Walk in, dine in, or order online — we've got every craving covered.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-primary tracking-[0.3em] mb-2">ADDRESS</div>
              <div className="text-display text-xl leading-tight">
                Falnir Main Road
                <br />
                Bendoor, Mangalore
                <br />
                Karnataka, India
              </div>
            </div>
            <div>
              <div className="text-xs text-primary tracking-[0.3em] mb-2">HOURS</div>
              <div className="text-display text-xl leading-tight">
                Mon – Sun
                <br />
                11:00 AM – 11:30 PM
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/FmaokBwPqbehC7SH7?g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border bg-card p-4 hover:border-primary/60 transition block"
            >
              <div className="text-xs text-primary tracking-[0.3em] mb-2">LOCATION</div>
              <div className="text-display text-xl leading-tight">Get Directions</div>
              <div className="text-sm text-muted-foreground mt-1">Open in Google Maps ↗</div>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CALL_LINK}
              className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-flame"
            >
              Call +91 86002 07544
            </a>
            <a
              href={CALL_LINK}
              className="rounded-full border border-border bg-card/60 px-6 py-3 font-semibold hover:bg-card transition"
            >
              Call to Order
            </a>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href="https://www.swiggy.com/city/mangaluru/grub-monkeys-lalbagh-falnir-rest1257104"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              Order on Swiggy ↗
            </a>
            <a
              href="https://www.zomato.com/mangalore/grub-monkeys-bendoor/order"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              Order on Zomato ↗
            </a>
            <a
              href="https://www.instagram.com/grubmonkeysmangalore/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              Instagram ↗
            </a>
          </div>
        </div>
        <form
          className="rounded-3xl border border-border bg-card p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = (fd.get("name") as string) || "";
            const phone = (fd.get("phone") as string) || "";
            const email = (fd.get("email") as string) || "";
            const message = (fd.get("message") as string) || "";
            const text = `Hi Grub Monkeys,%0A%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}%0A%0AMessage: ${message}`;
            window.open(`https://wa.me/${PHONE}?text=${text}`, "_blank", "noopener,noreferrer");
          }}
        >
          <h3 className="text-display text-3xl">Send us a holler</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Catering, reservations, or just want to say the burger changed your life.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Name"
              required
              className="rounded-xl bg-background border border-border px-4 py-3 outline-none focus:border-primary"
            />
            <input
              name="phone"
              placeholder="Phone"
              className="rounded-xl bg-background border border-border px-4 py-3 outline-none focus:border-primary"
            />
            <input
              name="email"
              placeholder="Email"
              className="sm:col-span-2 rounded-xl bg-background border border-border px-4 py-3 outline-none focus:border-primary"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              required
              className="sm:col-span-2 rounded-xl bg-background border border-border px-4 py-3 outline-none focus:border-primary resize-none"
            />
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground shadow-flame hover:scale-[1.02] transition cursor-pointer"
          >
            Send Message
          </button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            By submitting you agree to be contacted by Grub Monkeys.
          </p>
        </form>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-full bg-primary p-0.5"
          />
          <span className="text-display tracking-wider text-foreground">GRUB MONKEYS</span>
          <span>· Falnir, Mangalore</span>
        </div>
        <div>© {new Date().getFullYear()} Grub Monkeys. Made loud.</div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Marquee />
        <div className="pt-4">
          <Nav />
        </div>
        <main>
          <Hero />
          <Marquee />
          <Featured />
          <MenuList />
          <Story />
          <Feed />
          <Testimonials />
          <FindUs />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
