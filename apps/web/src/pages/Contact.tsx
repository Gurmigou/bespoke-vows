import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Paperclip, X, Send, CheckCircle2 } from "lucide-react";

type Category = "question" | "bug";

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
      <div className="min-h-screen font-geologica bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="w-14 h-14 text-pink-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Повідомлення надіслано!</h2>
          <p className="text-muted-foreground text-sm">
            Ми отримали ваше звернення та відповімо на{" "}
            <span className="font-medium text-foreground">{email}</span> найближчим часом.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-geologica bg-gradient-to-b from-pink-50 to-white">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              <Mail className="w-4 h-4" />
              Підтримка
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Зв'яжіться з нами</h1>
            <p className="text-muted-foreground">
              Маєте питання або знайшли помилку? Напишіть нам — відповімо протягом доби.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Category toggle */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Тема звернення</Label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl">
                  {(["question", "bug"] as Category[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${
                        category === c
                          ? "bg-white shadow text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c === "question" ? "Задати питання" : "Повідомити про помилку"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">Ваше ім'я</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Іван Петренко"
                  required
                  className="rounded-xl border-gray-200 focus-visible:ring-pink-300"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="rounded-xl border-gray-200 focus-visible:ring-pink-300"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">
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
                  className="rounded-xl border-gray-200 resize-none focus-visible:ring-pink-300"
                />
              </div>

              {/* Screenshot upload */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">
                  Скриншот <span className="text-muted-foreground font-normal">(необов'язково)</span>
                </Label>

                {screenshot ? (
                  <div className="flex items-center gap-3 p-3 bg-pink-50 border border-pink-100 rounded-xl">
                    <img
                      src={URL.createObjectURL(screenshot)}
                      alt="preview"
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <span className="text-sm text-foreground flex-1 truncate">{screenshot.name}</span>
                    <button
                      type="button"
                      onClick={() => { setScreenshot(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/50 transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
                    <p className="text-sm text-muted-foreground">
                      Перетягніть зображення або <span className="text-pink-500 font-medium">оберіть файл</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG до 10 МБ</p>
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
                className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Надсилаємо...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Надіслати
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Direct email fallback */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Або напишіть напряму:{" "}
            <a href="mailto:support@bespokevows.com" className="text-pink-500 hover:underline font-medium">
              support@bespokevows.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
