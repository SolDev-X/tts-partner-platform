import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

interface TestimonialProps {
  className?: string;
  quote?: string;
  author?: {
    name: string;
    role: string;
    avatar: {
      src: string;
      alt: string;
      className?: string;
    };
  };
}

const Testimonial = ({
  className,
  quote = "入驻流程比想象中顺利很多,资料一次就通过了,省了不少时间,团队响应也很及时。",
  author = {
    name: "深圳某 3C 类目卖家",
    role: "定邀直邮 · TikTok Shop 欧盟",
    avatar: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
      alt: "Customer Name",
    },
  },
}: TestimonialProps) => {
  return (
    <section className={cn("py-18", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <p className="mb-16 max-w-4xl px-8 font-medium lg:text-3xl">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="flex items-center gap-2 md:gap-4">
            <Avatar className="size-12 md:size-16">
              <AvatarImage src={author.avatar.src} alt={author.avatar.alt} />
              <AvatarFallback>{author.name}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium md:text-base">{author.name}</p>
              <p className="text-sm text-muted-foreground md:text-base">
                {author.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
