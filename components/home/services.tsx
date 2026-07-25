import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {services} from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function Services() {
  return (
    <section id="services" className="bg-black text-white mt-30">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            我们的服务
          </p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            一站式跨境电商解决方案
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="group">
              <Card>
                <CardHeader>
                  <CardTitle>{s.label}</CardTitle>
                  <CardDescription className="">
                    {s.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <div className="flex items-center gap-1 text-sm font-medium text-black">
                    了解更多
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
