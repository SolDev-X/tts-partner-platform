"use client";

import {useState} from "react";
import {submitContact} from "./actions";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    const result = await submitContact(formData);
    setStatus(result.success ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-black">提交成功</h1>
        <p className="mt-3 text-neutral-600">我们会尽快通过微信联系您</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-black">联系我们</h1>
      <p className="mt-3 text-neutral-600">
        留下您的联系方式，我们会尽快与您沟通
      </p>

      <form action={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-black">姓名/称呼 *</label>
          <input
            name="name"
            required
            className="mt-1 w-full border border-black px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">微信号 *</label>
          <input
            name="wechat"
            required
            className="mt-1 w-full border border-black px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">需求描述</label>
          <textarea
            name="message"
            rows={4}
            className="mt-1 w-full border border-black px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          提交
        </button>
      </form>
    </div>
  );
}
