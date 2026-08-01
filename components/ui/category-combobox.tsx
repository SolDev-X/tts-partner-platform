"use client";

import {useState} from "react";
import {Check, ChevronDown} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import type {OptionItem} from "@/lib/types";

interface CategoryComboboxProps {
  options: OptionItem[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabledIds?: string[];
}

const CategoryCombobox = ({
  options,
  value,
  onChange,
  placeholder = "请选择主营类目",
  disabledIds = [],
}: CategoryComboboxProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selected ? selected.name : placeholder}
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-[var(--anchor-width)] p-0">
        <Command>
          <CommandInput placeholder="搜索类目" />
          <CommandList>
            <CommandEmpty>未找到匹配的类目</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const disabled = disabledIds.includes(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    disabled={disabled}
                    onSelect={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === option.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export {CategoryCombobox};
