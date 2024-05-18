import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options, groupBy) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption = {};
  options.forEach((option) => {
    const key = option[groupBy] || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption, picked, valueKey) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));
  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p[valueKey] === val[valueKey]),
    );
  }
  return cloneOption;
}

function isOptionsExist(groupOption, targetOption) {
  for (const [key, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}

const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    placeholder,
    defaultOptions = [],
    options: arrayOptions,
    delay,
    onSearch,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    disabled,
    groupBy,
    className,
    badgeClassName,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps,
    inputProps,
    valueKey = "value",
    labelKey = "label",
  } = props;

  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState(value || []);
  const [options, setOptions] = useState(
    transToGroupOption(defaultOptions, groupBy),
  );
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

  useImperativeHandle(
    ref,
    () => ({
      selectedValue: [...selected],
      input: inputRef.current,
      focus: () => inputRef.current?.focus(),
    }),
    [selected],
  );

  const handleUnselect = useCallback(
    (option) => {
      const newOptions = selected.filter(
        (s) => s[valueKey] !== option[valueKey],
      );
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected],
  );

  const handleKeyDown = useCallback(
    (e) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            handleUnselect(selected[selected.length - 1]);
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [handleUnselect, selected],
  );

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) {
      return;
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [defaultOptions, arrayOptions, groupBy, onSearch, options]);

  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;

      if (triggerSearchOnFocus) {
        await doSearch();
      }

      if (debouncedSearchTerm) {
        await doSearch();
      }
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  const CreatableItem = () => {
    if (!creatable) return undefined;
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find((s) => s.value === inputValue)
    ) {
      return undefined;
    }

    const Item = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSelect={(value) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length);
            return;
          }
          setInputValue("");
          const newOptions = [...selected, { value, label: value }];
          setSelected(newOptions);
          onChange?.(newOptions);
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    // For normal creatable
    if (!onSearch && inputValue.length > 0) {
      return Item;
    }

    // For async search creatable. avoid showing creatable item before loading at first.
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
      return Item;
    }

    return undefined;
  };

  const EmptyItem = useCallback(() => {
    if (!emptyIndicator) return undefined;

    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      );
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
  }, [creatable, emptyIndicator, onSearch, options]);

  const selectables = useMemo(
    () => removePickedOption(options, selected, valueKey),
    [options, selected],
  );

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter;
    }

    if (creatable) {
      return (value, search) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
      };
    }
    // Using default filter in `cmdk`. We don't have to provide it.
    return undefined;
  }, [creatable, commandProps?.filter]);

  return (
    <Command
      {...commandProps}
      onKeyDown={(e) => {
        handleKeyDown(e);
        commandProps?.onKeyDown?.(e);
      }}
      className={cn(
        "h-auto overflow-visible bg-transparent",
        commandProps?.className,
      )}
      shouldFilter={
        commandProps?.shouldFilter !== undefined
          ? commandProps.shouldFilter
          : !onSearch
      } // When onSearch is provided, we don't want to filter the options. You can still override it.
      filter={commandFilter()}
    >
      <div
        className={cn(
          "min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          {
            "px-3 py-2": selected.length !== 0,
            "cursor-text": !disabled && selected.length !== 0,
          },
          className,
        )}
        onClick={() => {
          if (disabled) return;
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <Badge
                key={option[valueKey]}
                className={cn(
                  "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                  "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                  badgeClassName,
                )}
                data-fixed={option.fixed}
                data-disabled={disabled || undefined}
              >
                {option[labelKey]}
                <button
                  className={cn(
                    "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    (disabled || option.fixed) && "hidden",
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={(value) => {
              setInputValue(value);
              inputProps?.onValueChange?.(value);
            }}
            onBlur={(event) => {
              setOpen(false);
              inputProps?.onBlur?.(event);
            }}
            onFocus={(event) => {
              setOpen(true);
              triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
              inputProps?.onFocus?.(event);
            }}
            placeholder={
              hidePlaceholderWhenSelected && selected.length !== 0
                ? ""
                : placeholder
            }
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
              {
                "w-full": hidePlaceholderWhenSelected,
                "px-3 py-2": selected.length === 0,
                "ml-1": selected.length !== 0,
              },
              inputProps?.className,
            )}
          />
        </div>
      </div>
      <div className="relative">
        {open && (
          <CommandList className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            {isLoading ? (
              <>{loadingIndicator}</>
            ) : (
              <>
                {EmptyItem()}
                {CreatableItem()}
                {!selectFirstItem && (
                  <CommandItem value="-" className="hidden" />
                )}
                {Object.entries(selectables).map(([key, dropdowns]) => (
                  <CommandGroup
                    key={key}
                    heading={key}
                    className="h-full overflow-auto"
                  >
                    <>
                      {dropdowns.map((option) => {
                        return (
                          <CommandItem
                            key={option[valueKey]}
                            value={option[valueKey]}
                            disabled={option.disable}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              if (selected.length >= maxSelected) {
                                onMaxSelected?.(selected.length);
                                return;
                              }
                              setInputValue("");
                              const newOptions = [...selected, option];
                              setSelected(newOptions);
                              onChange?.(newOptions);
                            }}
                            className={cn(
                              "cursor-pointer",
                              option.disable &&
                                "cursor-default text-muted-foreground",
                            )}
                          >
                            {option[labelKey]}
                          </CommandItem>
                        );
                      })}
                    </>
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  );
});

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
