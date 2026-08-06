import {NextResponse} from "next/server";
import {z} from "zod";

import {auth} from "@/lib/auth";
import {services} from "@/lib/data";
import {prisma} from "@/lib/prisma";
import type {ServiceSelection} from "@/lib/types";
import {matchVariantRule} from "@/lib/utils";

const createOrderSchema = z.object({
  serviceId: z.string().min(1),
  selection: z.record(z.string(), z.string()),
});

function isSelectionSupported(
  service: (typeof services)[number],
  selection: ServiceSelection,
) {
  const optionGroups = service.optionGroups ?? [];

  for (const group of optionGroups) {
    const value = selection[group.key];
    const option = group.options.find((item) => item.id === value);

    if (!option) return false;

    if (
      option.availableSites &&
      selection.sites &&
      !option.availableSites.includes(selection.sites)
    ) {
      return false;
    }
  }

  return !(service.combinationRules ?? []).some((rule) => {
    const whenMatched = Object.entries(rule.when).every(([key, expected]) => {
      const actual = selection[key];
      return Array.isArray(expected)
        ? expected.includes(actual)
        : expected === actual;
    });

    if (!whenMatched) return false;

    return Object.entries(rule.disable).some(([key, disabledValues]) =>
      disabledValues.includes(selection[key]),
    );
  });
}

function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `CB${date}-${suffix}`;
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = createOrderSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({error: "Invalid order data"}, {status: 400});
  }

  const service = services.find((item) => item.id === body.data.serviceId);
  if (!service || !isSelectionSupported(service, body.data.selection)) {
    return NextResponse.json({error: "Unsupported service selection"}, {status: 422});
  }

  const selection = Object.fromEntries(
    (service.optionGroups ?? []).map((group) => [
      group.key,
      body.data.selection[group.key],
    ]),
  );

  if (!matchVariantRule(service.variantRules ?? [], selection)) {
    return NextResponse.json({error: "No plan available"}, {status: 422});
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: createOrderNumber(),
      userId: session.user.id,
      serviceId: service.id,
      serviceLabel: service.label,
      selection,
    },
    select: {id: true, orderNumber: true},
  });

  return NextResponse.json({order}, {status: 201});
}
