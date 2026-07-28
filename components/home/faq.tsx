import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {faqs} from "@/lib/data";

export default function Faq() {
  return (
    <section className="mt-25">
      <div className="mx-auto max-w-4xl px-4 py-25 flex flex-col gap-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            常见问题
          </p>
          <h2 className="mt-2 text-2xl font-bold text-black md:text-3xl">
            有疑问？我们来解答
          </h2>
        </div>

        <Accordion className="mt-15">
          {faqs.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
