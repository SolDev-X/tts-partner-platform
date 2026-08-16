import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {DataTable} from "@/components/orders/customer/orders-table";
import {auth} from "@/lib/auth";

import data from "./data.json";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 py-4 md:gap-6 md:py-6">
      <DataTable data={data} />
    </div>
  );
}
