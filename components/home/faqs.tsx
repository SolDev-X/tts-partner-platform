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
      question: "我们主要提供哪些服务?",
      answer:
        "我们专注店铺层面的入驻与权限代办服务，涵盖入驻代办、类目报白、权限开通等，不涉及店铺运营、广告投放或 TikTok 橱窗等内容运营类服务。",
    },
    {
      id: "item-2",
      question: "支持哪些站点和店铺模式？",
      answer:
        "覆盖美区、日区、英区、欧盟、东南亚、墨西哥等主流站点，支持 跨境POP、跨境直邮、本土等店铺模式，具体以所选服务的可选项为准。",
    },
    {
      id: "item-3",
      question: "合作交易方式是怎样的？",
      answer:
        "合作方式为先付后办理，为解决信任问题、保障双方资金安全，交易可通过第三方担保平台完成；后续将上线线上支付系统，进一步简化付款流程。",
    },
    {
      id: "item-4",
      question: "审核不通过如何处理？",
      answer:
        "具体处理方式将按办理前双方约定的服务细则执行，包括责任范围、保障期限、退款标准等，各服务的具体条款以下单前的约定说明为准。",
    },
    {
      id: "item-5",
      question: "办理过程中如何跟进进度？",
      answer:
        "办理期间将通过微信/飞书及时同步进度，如遇异常情况会主动告知并协助处理；后续也计划上线独立的进度查询页面，方便随时查看办理状态。",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="space-y-12">
          <h2 className="text-foreground text-center md:text-4xl text-3xl font-semibold">
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
