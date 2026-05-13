import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, Paperclip, X, Send, CheckCircle2, MessageCircle, Bug, Clock } from "lucide-react";

type Category = "question" | "bug";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const Contact = () => {
  const [category, setCategory] = useState<Category>("question");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setScreenshot(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setScreenshot(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen font-geologica bg-[hsl(32,20%,96%)] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-stone-500" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-stone-800">Дякуємо!</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Ми отримали ваше звернення та відповімо на{" "}
              <span className="font-medium text-stone-700">{email}</span> найближчим часом.
            </p>
          </div>
          <p className="text-xs text-stone-400">Зазвичай протягом 24 годин</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-geologica bg-[hsl(32,20%,96%)]">
      {/* Header */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">Підтримка</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 tracking-tight">
            Зв'яжіться з нами
          </h1>
          <p className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
            Маєте питання або знайшли помилку? Напишіть нам — відповімо протягом доби.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6 items-start">

            {/* Sidebar */}
            <aside className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col gap-5 lg:sticky lg:top-24">
              <h2 className="text-base font-semibold text-stone-800">Контакти</h2>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-700">Відповідь протягом 24 годин</p>
                  <p className="text-xs text-stone-400 mt-0.5">У будні зазвичай швидше</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-700">Електронна пошта</p>
                  <a
                    href="mailto:support@beloved.com.ua"
                    className="text-xs text-stone-500 hover:text-stone-800 mt-0.5 inline-block transition-colors"
                  >
                    support@beloved.com.ua
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                  <TelegramIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-700">Telegram</p>
                  <a
                    href="https://t.me/beloved_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-500 hover:text-stone-800 mt-0.5 inline-block transition-colors"
                  >
                    @beloved_support
                  </a>
                </div>
              </div>

              <div className="pt-1 border-t border-stone-100">
                <a
                  href="https://t.me/beloved_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium transition-colors"
                >
                  <TelegramIcon className="h-4 w-4" />
                  Написати в Telegram
                </a>
              </div>
            </aside>

            {/* Form */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                {/* Category toggle */}
                <div>
                  <Label className="text-sm font-medium text-stone-700 mb-2 block">
                    Тема звернення
                  </Label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
                    {(["question", "bug"] as Category[]).map((c) => {
                      const Icon = c === "question" ? MessageCircle : Bug;
                      const active = category === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(c)}
                          className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                            active
                              ? "bg-white shadow-sm text-stone-800"
                              : "text-stone-400 hover:text-stone-600"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {c === "question" ? "Питання" : "Помилка"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-stone-700 mb-1.5 block">
                      Ваше ім'я
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Іван Петренко"
                      required
                      className="h-10 rounded-lg bg-white border-stone-200 focus-visible:ring-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-stone-700 mb-1.5 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-10 rounded-lg bg-white border-stone-200 focus-visible:ring-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-stone-700 mb-1.5 block">
                    {category === "question" ? "Ваше питання" : "Опис помилки"}
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      category === "question"
                        ? "Опишіть, що вас цікавить..."
                        : "Опишіть, що сталося та як відтворити помилку..."
                    }
                    required
                    rows={5}
                    className="rounded-lg bg-white border-stone-200 resize-none focus-visible:ring-stone-300 text-sm"
                  />
                </div>

                {/* Screenshot upload */}
                <div>
                  <Label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    Скриншот{" "}
                    <span className="text-stone-400 font-normal">(необов'язково)</span>
                  </Label>

                  {screenshot ? (
                    <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                      <img
                        src={URL.createObjectURL(screenshot)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-700 truncate">{screenshot.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {(screenshot.size / 1024).toFixed(0)} КБ
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshot(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="Видалити"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-stone-200 rounded-xl p-5 text-center cursor-pointer hover:border-stone-300 hover:bg-stone-50 transition-all"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-400 mb-2">
                        <Paperclip className="w-4 h-4" />
                      </span>
                      <p className="text-sm text-stone-500">
                        Перетягніть зображення або{" "}
                        <span className="text-stone-700 font-medium">оберіть файл</span>
                      </p>
                      <p className="text-xs text-stone-400 mt-1">PNG, JPG до 10 МБ</p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-medium rounded-xl bg-stone-800 hover:bg-stone-900 text-white shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Надсилаємо...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" />
                      Надіслати
                    </span>
                  )}
                </Button>

                <p className="text-center text-xs text-stone-400">
                  Надсилаючи форму, ви погоджуєтесь з нашою{" "}
                  <Link to="/terms" className="text-stone-500 underline-offset-2 hover:underline">
                    політикою конфіденційності
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
