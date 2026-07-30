"use client";

import {cn} from "@/lib/utils";
import {services} from "@/lib/data";
import Link from "next/link";

interface ServicesProps {
  className?: string;
}

const Services = ({className}: ServicesProps) => {
  return (
    <section className={cn("py-32", className)} id="services">
      <div className="container mx-auto items-center">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              我们的服务
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <Link
                key={index}
                href={`/services/${service.id}`}
                className="space-y-6 rounded-lg border border-border p-8 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <h3 className="md:text-xl text-base font-semibold">
                    {service.label}
                  </h3>
                </div>
                <p className="leading-relaxed text-muted-foreground text-sm md:text-base">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
