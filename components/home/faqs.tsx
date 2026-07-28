"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "审核不通过怎么办？",
      answer: "审核未通过将全额退款，无需承担额外费用。",
    },
    {
      id: "item-2",
      question: "需要提供哪些资料？",
      answer:
        "根据服务类型不同，可能需要店铺主体名称、ShopID、邀请码等信息，具体会在提交申请时说明。",
    },
    {
      id: "item-3",
      question: "大概多久能出审核结果？",
      answer: "提交后一般约7个工作日显示结果，具体以平台审核为准。",
    },
    {
      id: "item-4",
      question: "支持哪些国家/站点？",
      answer: "覆盖美国、日本、英国、欧盟十二国、东南亚、墨西哥等站点。",
    },
    {
      id: "item-5",
      question: "已有店铺可以升级为混发模式吗？",
      answer:
        "仅支持跨境直邮商家升级为海外仓混发模式，欧盟/英国站点需具备仓储国VAT，日本站点无此要求。",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-12">
          <h2 className="text-foreground text-center text-4xl font-semibold">
            常见问题
          </h2>

          <Accordion type="single" collapsible className="-mx-2 sm:mx-0">
            {faqItems.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-muted peer rounded-xl border-none px-5 py-1 data-[state=open]:border-none md:px-7"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-5 -mb-px group-last:hidden peer-data-[state=open]:opacity-0 md:mx-7" />
              </div>
            ))}
          </Accordion>

          <p className="text-muted-foreground text-center">
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
