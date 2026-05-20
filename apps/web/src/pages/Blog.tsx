import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { blogPosts, formatPostDate } from "@/lib/blogPosts";

const Blog = () => {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen font-geologica overflow-x-hidden">
      {/* ======================= HERO ======================= */}
      <section className="relative isolate overflow-hidden bg-[hsl(32,30%,97%)] pt-20 pb-20 md:pt-28 md:pb-24 px-4">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-[20rem] w-[20rem] rounded-full bg-rose-200/40 blur-3xl" />

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(24 20% 20% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(24 20% 20% / 1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/70 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-medium text-foreground/70 shadow-sm">
            <BookOpen className="h-3.5 w-3.5 text-pink-500" />
            Блог
          </div>

          <h1 className="text-4xl md:text-7xl font-bold leading-[1.05] tracking-tight font-geologica text-foreground">
            Історії, поради та{" "}
            <span
              className="text-5xl md:text-[76px] bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 700 }}
            >
              натхнення
            </span>
          </h1>

        </div>

        {/* Bottom soft fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[hsl(28,30%,93%)]" />
      </section>

      {/* ======================= FEATURED POST ======================= */}
      {featured && (
        <section className="relative py-16 md:py-20 px-4 bg-[hsl(28,30%,93%)] overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/4 h-[24rem] w-[24rem] rounded-full bg-pink-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/4 h-[24rem] w-[24rem] rounded-full bg-amber-200/30 blur-3xl" />

          <div className="container mx-auto max-w-5xl relative">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px flex-1 bg-foreground/10" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-pink-500">
                Свіжа стаття
              </span>
              <span className="h-px flex-1 bg-foreground/10" />
            </div>

            <Link
              to={`/blog/${featured.slug}`}
              className="group relative block rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/5 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/0 to-amber-50/0 group-hover:from-pink-50 group-hover:to-amber-50 transition-all duration-500" />

              <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 p-7 md:p-10 items-center">
                <div className="min-w-0 order-2 md:order-1">
                  <div className="flex items-center gap-3 text-xs text-foreground/50 mb-4">
                    <span>{formatPostDate(featured.date)}</span>
                    <span className="h-1 w-1 rounded-full bg-foreground/30" />
                    <span>{featured.readingMinutes} хв читання</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-tight font-geologica group-hover:text-pink-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-foreground/65 leading-relaxed line-clamp-3 md:line-clamp-none">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pink-600">
                    Читати статтю
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

                <div
                  aria-hidden
                  className="order-1 md:order-2 mx-auto h-32 w-32 md:h-44 md:w-44 shrink-0 flex items-center justify-center rounded-3xl bg-gradient-to-br from-pink-300/30 via-rose-200/40 to-amber-200/40 text-6xl md:text-7xl shadow-inner"
                >
                  {featured.coverEmoji}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ======================= POSTS GRID ======================= */}
      <section className="relative py-20 md:py-24 px-4 bg-[hsl(32,30%,97%)] overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative">
          {rest.length === 0 ? (
            <p className="text-center text-foreground/55">Скоро тут з'являться нові статті.</p>
          ) : (
            <ul className="max-w-4xl mx-auto flex flex-col gap-5 md:gap-6">
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group relative block rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/5 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50/0 to-amber-50/0 group-hover:from-pink-50 group-hover:to-amber-50 transition-all duration-500" />

                    <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-5 md:gap-8 items-center p-5 md:p-7">
                      {/* Cover emoji medallion */}
                      <div
                        aria-hidden
                        className="h-20 w-20 md:h-28 md:w-28 shrink-0 flex items-center justify-center rounded-2xl md:rounded-3xl bg-gradient-to-br from-pink-200/40 via-rose-100/40 to-amber-200/40 text-4xl md:text-6xl shadow-inner transition-transform duration-500 group-hover:scale-105"
                      >
                        {post.coverEmoji}
                      </div>

                      {/* Body */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 text-xs text-foreground/50 mb-2">
                          <span>{formatPostDate(post.date)}</span>
                          <span className="h-1 w-1 rounded-full bg-foreground/30" />
                          <span>{post.readingMinutes} хв читання</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug font-geologica group-hover:text-pink-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm md:text-base text-foreground/65 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/60 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white transition-all duration-500">
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
