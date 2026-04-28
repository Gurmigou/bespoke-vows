import { Link } from "react-router-dom";
import { blogPosts, formatPostDate } from "@/lib/blogPosts";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background font-geologica">
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Блог
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight font-geologica">
            Історії, поради та натхнення
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Невеликі статті про те, як зробити день, запрошення та підготовку
            справді своїми.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <ul className="divide-y divide-border">
          {blogPosts.map((post) => (
            <li key={post.slug} className="py-8 first:pt-0">
              <Link
                to={`/blog/${post.slug}`}
                className="group grid grid-cols-[1fr_auto] gap-6 md:gap-10 items-start"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{formatPostDate(post.date)}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>{post.readingMinutes} хв читання</span>
                  </div>
                  <h2 className="text-2xl md:text-[28px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors font-geologica">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div
                  aria-hidden
                  className="hidden md:flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-5xl"
                >
                  {post.coverEmoji}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Blog;
