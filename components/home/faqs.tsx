"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {homeFAQs} from "@/lib/data";

export default function FAQs() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="space-y-12">
          <h2 className="text-foreground text-center md:text-4xl text-3xl font-semibold">
            常见问题
          </h2>

          <Accordion type="single" collapsible className="-mx-2 sm:mx-0">
            {homeFAQs.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-muted peer rounded-xl border-none px-5 py-1 data-[state=open]:border-none md:px-7"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="md:text-base text-sm">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-5 -mb-px group-last:hidden peer-data-[state=open]:opacity-0 md:mx-7" />
              </div>
            ))}
          </Accordion>

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
