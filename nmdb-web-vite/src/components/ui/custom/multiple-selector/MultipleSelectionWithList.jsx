import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import axiosInstance from "@/helpers/axiosSetup";

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

function removePickedOption(groupOption, picked, keyLabel, keyValue) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value?.filter(
      (val) => !picked?.find((p) => p?.[keyValue] === val?.[keyValue]),
    );
  }
  return cloneOption;
}

const MultipleSelectorWithList = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      keyValue = "value",
      keyLabel = "label",
      extraLabel = "email",
      imgLabel = "avatar",
      apiPath,
      minSearchTrigger = 1,
      triggerOnSearch,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      triggerSearchOnFocus,
      disabled,
      className,
      replaceOnMaxSelected = false,
      selectFirstItem = true,
      setFromIdArray,
      commandProps,
      inputProps,
    },
    ref,
  ) => {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    if(setFromIdArray && value?.length > 0 && value.every(element => typeof element !== 'object')){
      value = value?.map(v=>arrayDefaultOptions.find(a => a[keyValue] == v))
    }
    const [selected, setSelected] = React.useState(value || []);
    const [options, setOptions] = React.useState(
      transToGroupOption(arrayDefaultOptions),
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebouncedState(inputValue, delay || 500);

    const getData = async (searchTerm) => {
      const response = await axiosInstance
        .get(apiPath + searchTerm)
        .then((resp) => {
          console.log(resp);
          if (resp) {
            const { items } = resp.data.data;
            return items;
          }
        })
        .catch((error) => {
          console.log(error);
          return [];
        });
      return response;
    };
    if (triggerOnSearch) {
      onSearch = async (searchTerm) => {
        if (searchTerm.length >= minSearchTrigger) {
          const data = await getData(searchTerm);
          return data;
        }
      };
    }
    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current,
      }),
      [selected],
    );
    const handleUnselect = React.useCallback(
      (option) => {
        const newOptions = selected.filter(
          (s) => s[keyValue] !== option[keyValue],
        );
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected],
    );

    const handleKeyDown = React.useCallback(
      (e) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input[keyValue] === "" && selected.length > 0) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
          // This is not a default behaviour of the <input /> field
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
      const newOption = transToGroupOption(arrayOptions || []);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, onSearch, options]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || []));
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
    }, [debouncedSearchTerm, open, triggerSearchOnFocus]);

    const EmptyItem = React.useCallback(() => {
      // For async search that showing emptyIndicator
      if (onSearch && Object.keys(options).length === 0) {
        if (
          !debouncedSearchTerm ||
          debouncedSearchTerm.length < minSearchTrigger
        )
          return (
            <CommandEmpty className="w-full p-2 text-center text-sm text-muted-foreground">
              Initiate the search with a minimum of {3} characters.
            </CommandEmpty>
          );
        return (
          <CommandItem
            value="-"
            disabled
            className="w-full justify-center p-2 text-center text-sm text-muted-foreground"
          >
            {emptyIndicator || "No result found."}
          </CommandItem>
        );
      }

      return <CommandEmpty>No result found.</CommandEmpty>;
    }, [emptyIndicator, onSearch, options]);

    const selectables = React.useMemo(
      () => removePickedOption(options, selected, keyLabel, keyValue),
      [options, selected],
    );
    return (
      <div>
        <div className="relative">
          <Command
            {...commandProps}
            onKeyDown={(e) => {
              handleKeyDown(e);
              commandProps?.onKeyDown?.(e);
            }}
            className={cn(
              "overflow-visible bg-transparent",
              commandProps?.className,
            )}
            shouldFilter={
              commandProps?.shouldFilter !== undefined
                ? commandProps.shouldFilter
                : !onSearch
            } // When onSearch is provided, we don't want to filter the options. You can still override it.
          >
            <div
              className={cn(
                "group min-h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className,
              )}
            >
              <div className="flex flex-wrap gap-x-2 gap-y-3 ">
                {selected.map((option, index) => {
                  return (
                    <div
                      key={"badge" + option[keyValue]}
                      data-fixed={option.fixed}
                      data-disabled={disabled}
                      className="flex"
                    >
                      <div className="flex items-center gap-1 rounded-md border border-input bg-muted/40 p-1">
                        {option[imgLabel] && (
                          <Avatar className="hidden h-6 w-6 sm:flex">
                            <AvatarImage src={option[imgLabel]} alt="Avatar" />
                            <AvatarFallback>{option[keyLabel]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="grid">
                          <p className="text-sm font-medium leading-none">
                            {option[keyLabel]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {option[extraLabel]}
                          </p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => handleUnselect(option)}
                              >
                                <Cross2Icon className="size-3" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Remove</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
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
                    "ml-2 flex-1  bg-transparent outline-none placeholder:text-muted-foreground",
                    inputProps?.className,
                  )}
                />
              </div>
            </div>
            <div className="relative mt-1">
              {open && (
                <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                  {isLoading ? (
                    <p className="w-full text-center leading-10 text-muted-foreground">
                      {loadingIndicator || "Searching..."}
                    </p>
                  ) : (
                    <>
                      {EmptyItem()}
                      {!selectFirstItem && (
                        <CommandItem value="-" className="hidden" />
                      )}
                      {Object.entries(selectables).map(
                        ([key, dropdowns], index) => (
                          <ScrollArea
                            key={key + index}
                            viewPortClass="max-h-[295px] "
                          >
                            <CommandGroup heading={key} className="">
                              {dropdowns.map((option, index) => {
                                return (
                                  <CommandItem
                                    key={option[keyValue] + option.id}
                                    value={option[keyValue]}
                                    disabled={option.disable}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onSelect={() => {
                                      if (
                                        selected.length >= maxSelected &&
                                        !replaceOnMaxSelected
                                      ) {
                                        onMaxSelected?.(selected.length);
                                        return;
                                      }
                                      let newOptions = [...selected, option];
                                      if (replaceOnMaxSelected) {
                                        newOptions = [option];
                                        // setOpen(false)
                                      }
                                      setInputValue("");
                                      setSelected(newOptions);
                                      onChange?.(newOptions);
                                    }}
                                    className={cn(
                                      "cursor-pointer",
                                      option.disable &&
                                        "cursor-default text-muted-foreground",
                                    )}
                                  >
                                    <div className="hidden">
                                      {option[keyValue]}
                                    </div>
                                    {option[keyLabel]}

                                    {option[imgLabel] && (
                                      <img
                                        src={option[imgLabel]}
                                        alt="img"
                                        height={24}
                                        width={24}
                                        loading="lazy"
                                      />
                                    )}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </ScrollArea>
                        ),
                      )}
                    </>
                  )}
                </CommandList>
              )}
            </div>
          </Command>
        </div>
      </div>
    );
  },
);

export default MultipleSelectorWithList;
