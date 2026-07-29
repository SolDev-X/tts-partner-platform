"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useMemo} from "react";
import type {ControllerRenderProps} from "react-hook-form";
import {Controller, useForm} from "react-hook-form";
import z from "zod";

import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

/**
 * 下面这几个类型跟 lib/types.ts 里的 OptionItem / OptionGroup 保持一致，
 * 如果 lib/types.ts 已经 export 了同名类型，直接删掉这里的定义，
 * 改成 `import type {OptionItem, OptionGroup} from "@/lib/types";`
 */
export interface OptionItem {
  id: string;
  name: string;
  directMailRule?: "invite-only" | "both";
  availableSites?: string[];
}

export interface OptionGroup {
  key: string;
  title: string;
  options: OptionItem[];
}

type FormValues = Record<string, string>;

interface ServiceOptionsFormProps {
  optionGroups: OptionGroup[];
  onSubmitValues?: (values: FormValues) => void;
}

/**
 * 动态渲染每个服务的 optionGroups（站点 / 店铺类型 / 入驻方式 / 类目 / 开通模式……）
 * 并处理组之间的联动禁用逻辑：
 * - "onboardingType" 组：若所选站点 directMailRule 为 "invite-only"，则禁用 "public"（普招）选项
 * - 任意组里带 availableSites 的选项：若不在所选站点范围内，则禁用该选项
 */
const ServiceOptionsForm = ({
  optionGroups,
  onSubmitValues,
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

  const sitesGroup = optionGroups.find((group) => group.key === "sites");
  const selectedSiteId = form.watch("sites");
  const selectedSite = sitesGroup?.options.find(
    (option) => option.id === selectedSiteId,
  );

  // 站点切换后，清空已经不再适用的联动字段选择
  useEffect(() => {
    if (!selectedSiteId) return;
    optionGroups.forEach((group) => {
      if (group.key === "sites") return;
      const currentValue = form.getValues(group.key);
      if (!currentValue) return;
      const currentOption = group.options.find(
        (option) => option.id === currentValue,
      );
      if (
        currentOption &&
        isOptionDisabled(group, currentOption, selectedSite)
      ) {
        form.setValue(group.key, "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSiteId]);

  function onSubmit(values: FormValues) {
    if (onSubmitValues) {
      onSubmitValues(values);
    } else {
      // TODO: 接入实际的咨询提交逻辑（表单弹窗 / 企业微信 / 后端接口等）
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
                selectedSite={selectedSite}
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

function isOptionDisabled(
  group: OptionGroup,
  option: OptionItem,
  selectedSite?: OptionItem,
) {
  // 类目 / 其他带 availableSites 限制的选项：所选站点不在范围内则禁用
  if (
    option.availableSites &&
    selectedSite &&
    !option.availableSites.includes(selectedSite.id)
  ) {
    return true;
  }

  // 入驻方式：站点仅支持定邀时，禁用"普招"
  if (
    group.key === "onboardingType" &&
    option.id === "public" &&
    selectedSite?.directMailRule === "invite-only"
  ) {
    return true;
  }

  return false;
}

interface OptionRadioGroupProps {
  group: OptionGroup;
  selectedSite?: OptionItem;
  field: ControllerRenderProps<FormValues>;
}

const OptionRadioGroup = ({
  group,
  selectedSite,
  field,
}: OptionRadioGroupProps) => {
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
      {group.options.map((option) => (
        <ServiceOption
          key={`service-detail-option-${group.key}-${option.id}`}
          option={option}
          disabled={
            group.key !== "sites" &&
            isOptionDisabled(group, option, selectedSite)
          }
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
