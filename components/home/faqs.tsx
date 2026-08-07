import Link from "next/link";
import {ChevronDown} from "lucide-react";
import {homeFAQs} from "@/lib/data";

export default function FAQs() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="space-y-12">
          <h2 className="text-foreground text-center md:text-4xl text-3xl font-semibold">
            常见问题
          </h2>

          <div className="-mx-2 sm:mx-0">
            {homeFAQs.map((item) => (
              <details
                key={item.id}
                name="home-faq"
                className="group rounded-xl px-5 py-1 open:bg-muted md:px-7"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-4">
                  <p className="text-sm md:text-base">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <p className="text-muted-foreground text-center md:text-[14px] text-[12px]">
            找不到您要找的内容？请联系我们的{" "}
            <Link
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              客户支持团队
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
