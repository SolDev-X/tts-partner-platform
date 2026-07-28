import {services} from "@/lib/data";
import {notFound} from "next/navigation";
import ServiceClient from "./service-client";

export default async function ServicePage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const service = services.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return <ServiceClient service={service} />;
}
