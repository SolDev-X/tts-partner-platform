import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";

export default function Contact() {
  return (
    <section className="bg-background @container py-24 h-screen grid items-center">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col text-center">
          <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl">
            联系我们
          </h1>
          <p className="text-muted-foreground mt-4 text-balance">
            有疑问吗？我们很乐意为您解答。请给我们发送消息，我们会尽快回复您。
          </p>
        </div>

        <div className="@xl:grid-cols-5 mt-12 grid gap-8">
          <div className="@xl:col-span-2 space-y-6 *:space-y-2">
            <div>
              <p className="text-foreground text-sm font-medium">Email</p>
              <Link
                href="wenyao.dev@gmail.com"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                wenyao.dev@gmail.com
              </Link>
            </div>

            <div>
              <p className="text-foreground text-sm font-medium">Wechat</p>
              <Link
                href="tel:+15534046728"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                +86 15534046728
              </Link>
            </div>
          </div>

          <Card className="@xl:col-span-3 p-6">
            <form action="" className="space-y-5">
              <div className="@md:grid-cols-2 grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    微信/手机号
                  </Label>
                  <Input
                    type="tel"
                    id="tel"
                    name="tel"
                    placeholder="+86 188 8888 8888"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm">
                  咨询类型
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="例如:定邀入驻 / 类目报白 / 一品多仓开通"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm">
                  需求描述
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="请简单描述您的店铺情况和需求"
                  required
                  className="min-h-28"
                />
              </div>

              <Button className="w-full">提交咨询</Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
