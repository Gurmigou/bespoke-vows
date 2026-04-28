import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts, getPostBySlug, formatPostDate } from "@/lib/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center font-geologica">
        <h1 className="text-3xl font-bold mb-4">Статтю не знайдено</h1>
        <p className="text-muted-foreground mb-8">
          Можливо, її було перенесено або видалено.
        </p>
        <Link to="/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Повернутись до блогу
          </Button>
        </Link>
      </div>
    );
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-geologica">
      <article className="container mx-auto max-w-2xl px-4 pt-10 md:pt-16 pb-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Блог
        </Link>

        <div
          aria-hidden
          className="mb-8 flex h-44 w-full items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/5 text-7xl"
        >
          {post.coverEmoji}
        </div>

        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formatPostDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{post.readingMinutes} хв читання</span>
          </div>
        </header>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/90">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Готові створити власне запрошення?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Оберіть шаблон, додайте свою історію — і за кілька хвилин ваше
            запрошення вже у гостей.
          </p>
          <Link to="/templates" className="inline-block mt-6">
            <Button size="lg" className="h-12 px-8 text-base shadow-elegant">
              Створити запрошення
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </article>

      {otherPosts.length > 0 && (
        <section className="border-t bg-primary/5">
          <div className="container mx-auto max-w-3xl px-4 py-14">
            <h2 className="text-sm uppercase tracking-[0.2em] text-primary mb-6">
              Читати далі
            </h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {otherPosts.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="group block">
                    <div
                      aria-hidden
                      className="mb-3 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 text-4xl"
                    >
                      {p.coverEmoji}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {formatPostDate(p.date)}
                    </p>
                    <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
