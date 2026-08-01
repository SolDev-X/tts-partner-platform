"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useMemo} from "react";
import type {ControllerRenderProps} from "react-hook-form";
import {Controller, useForm} from "react-hook-form";
import z from "zod";

import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import type {CombinationRule, OptionGroup, OptionItem} from "@/lib/types";
import {CategoryCombobox} from "@/components/ui/category-combobox";

type FormValues = Record<string, string>;

interface ServiceOptionsFormProps {
  optionGroups: OptionGroup[];
  combinationRules?: CombinationRule[];
  onSubmitValues?: (values: FormValues) => void;
  onChange?: (values: FormValues) => void; // 有没有这一行？
}

const ServiceOptionsForm = ({
  optionGroups,
  combinationRules = [],
  onSubmitValues,
  onChange, // 有没有这一行？
}: ServiceOptionsFormProps) => {
  const formSchema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    optionGroups.forEach((group) => {
      shape[group.key] = z.string().min(1, `请选择${group.title}`);
    });
    return z.object(shape);
  }, [optionGroups]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 当前完整的选择状态：{ sites: "us", shopType: "direct", category: "jewelry", onboardingType: "invite" }
  const selection = form.watch(); // 这行保留，渲染时仍然需要用它做禁用逻辑判断

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange?.(values as FormValues);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sitesGroup = optionGroups.find((group) => group.key === "sites");
  const selectedSite = sitesGroup?.options.find(
    (option) => option.id === selection.sites,
  );

  // 任意一个上游字段变化后，清空已经因为规则变化而不再合法的下游选择
  useEffect(() => {
    optionGroups.forEach((group) => {
      const currentValue = form.getValues(group.key);
      if (!currentValue) return;

      const currentOption = group.options.find(
        (option) => option.id === currentValue,
      );

      const stillAvailable =
        !currentOption?.availableSites ||
        !selection.sites ||
        currentOption.availableSites.includes(selection.sites);

      const nowDisabled = isOptionDisabled(
        group,
        currentValue,
        selection,
        combinationRules,
      );

      if (!stillAvailable || nowDisabled) {
        form.setValue(group.key, "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selection.sites,
    selection.shopType,
    selection.category,
    selection.onboardingType,
  ]);

  function onSubmit(values: FormValues) {
    if (onSubmitValues) {
      onSubmitValues(values);
    } else {
      console.log("服务咨询需求：", values);
    }
  }

  if (!optionGroups.length) return null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {optionGroups.map((group) => (
        <Controller
          key={group.key}
          control={form.control}
          name={group.key}
          render={({field}) => (
            <fieldset className="space-y-3">
              <legend className="text-base font-semibold">{group.title}</legend>
              <OptionRadioGroup
                field={field}
                group={group}
                selection={selection}
                combinationRules={combinationRules}
              />
              {form.formState.errors[group.key] && (
                <p className="text-xs text-destructive">
                  {form.formState.errors[group.key]?.message as string}
                </p>
              )}
            </fieldset>
          )}
        />
      ))}

      <Button type="submit" size="lg" className="w-full">
        提交咨询需求
      </Button>
    </form>
  );
};

/**
 * 判断某个 option 是否应该禁用：
 * 1. 该 option 有 availableSites 限制，且当前选中站点不在范围内 → 禁用（一般用于"该站点不显示/不可选此项"）
 * 2. 命中 combinationRules 里某条规则的 when 条件，且该规则的 disable 里点名了这个 group + option → 禁用
 */
function isOptionDisabled(
  group: OptionGroup,
  optionId: string,
  selection: FormValues,
  combinationRules: CombinationRule[],
): boolean {
  const option = group.options.find((o) => o.id === optionId);

  if (
    option?.availableSites &&
    selection.sites &&
    !option.availableSites.includes(selection.sites)
  ) {
    return true;
  }

  return combinationRules.some((rule) => {
    const whenMatched = Object.entries(rule.when).every(([key, expected]) => {
      const actual = selection[key];
      if (!actual) return false;
      return Array.isArray(expected)
        ? expected.includes(actual)
        : expected === actual;
    });

    if (!whenMatched) return false;

    return rule.disable[group.key]?.includes(optionId) ?? false;
  });
}

interface OptionRadioGroupProps {
  group: OptionGroup;
  selection: FormValues;
  combinationRules: CombinationRule[];
  field: ControllerRenderProps<FormValues>;
}

const OptionRadioGroup = ({
  group,
  selection,
  combinationRules,
  field,
}: OptionRadioGroupProps) => {
  const disabledMap = group.options.map((option) => ({
    option,
    disabled: isOptionDisabled(group, option.id, selection, combinationRules),
  }));

  const allDisabled =
    disabledMap.length > 0 && disabledMap.every((item) => item.disabled);

  if (allDisabled) {
    return (
      <p className="rounded-md border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
        当前所选类目暂不支持入驻，请更换类目或站点。
      </p>
    );
  }

  // ↓↓↓ 判断逻辑加在这里，函数内部，不是JSX属性
  if (group.key === "category") {
    return (
      <CategoryCombobox
        options={group.options}
        value={field.value}
        onChange={field.onChange}
        disabledIds={disabledMap
          .filter((item) => item.disabled)
          .map((item) => item.option.id)}
      />
    );
  }

  return (
    <RadioGroup
      {...field}
      value={`${field.value ?? ""}`}
      onValueChange={(value) => {
        if (value !== field.value && value) {
          field.onChange(value);
        }
      }}
      className="flex flex-wrap gap-3"
    >
      {disabledMap.map(({option, disabled}) => (
        <ServiceOption
          key={`service-detail-option-${group.key}-${option.id}`}
          option={option}
          disabled={disabled}
        />
      ))}
    </RadioGroup>
  );
};

const ServiceOption = ({
  option,
  disabled,
}: {
  option: OptionItem;
  disabled: boolean;
}) => {
  return (
    <label
      htmlFor={option.id}
      className="relative flex h-10 min-w-16 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground has-disabled:pointer-events-none has-disabled:opacity-50"
    >
      <RadioGroupItem
        id={option.id}
        className="absolute size-px overflow-hidden opacity-0"
        value={option.id}
        disabled={disabled}
      />
      <span>{option.name}</span>
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full rotate-45 bg-border"></div>
        </div>
      )}
    </label>
  );
};

export {ServiceOptionsForm};
