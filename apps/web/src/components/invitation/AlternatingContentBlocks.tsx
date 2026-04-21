import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ContentBlock {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
}

interface AlternatingContentBlocksProps {
  blocks: ContentBlock[];
}

const AlternatingContentBlocks = ({ blocks }: AlternatingContentBlocksProps) => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl space-y-16 md:space-y-24">
        {blocks.map((block, index) => {
          const isEven = index % 2 === 1; // Block 1 (index 0) is left-right, Block 2 (index 1) is right-left, etc.
          
          return (
            <article
              key={index}
              className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {/* Mobile: Image first, then text */}
              {/* Desktop: Image position based on alternation */}
              <div
                className={cn(
                  "w-full md:w-1/2 flex items-center justify-center order-1",
                  isEven ? "md:justify-start md:order-1" : "md:justify-end md:order-2"
                )}
              >
                <div className="relative">
                  <img
                    src={block.imageUrl}
                    alt={block.imageAlt}
                    className="w-full max-w-[300px] md:max-w-[330px] h-auto object-contain relative z-10"
                    style={{
                      filter: "drop-shadow(0 15px 40px rgba(0, 0, 0, 0.4))",
                    }}
                  />
                </div>
              </div>

              {/* Text content */}
              <div
                className={cn(
                  "w-full md:w-1/2 flex flex-col justify-center space-y-4 md:space-y-6 order-2",
                  isEven ? "md:order-2" : "md:order-1"
                )}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground font-geologica">
                  {block.title}
                </h2>
                {block.description && block.description.trim() && (
                  <p className="text-lg text-muted-foreground leading-relaxed font-geologica">
                    {block.description}
                  </p>
                )}
                {block.ctaText && block.ctaLink && (
                  <div className="pt-2">
                    <Link to={block.ctaLink}>
                      <Button className="font-geologica">
                        {block.ctaText}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default AlternatingContentBlocks;

