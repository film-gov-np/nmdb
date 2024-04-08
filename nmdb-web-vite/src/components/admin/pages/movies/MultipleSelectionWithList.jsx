import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function transToGroupOption(options, groupBy) {
    if (options.length === 0) {
      return {};
    }
    if (!groupBy) {
      return {
        '': options,
      };
    }
  
    const groupOption = {};
    options.forEach((option) => {
      const key = (option[groupBy]) || '';
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
      cloneOption[key] = value.filter((val) => !picked.find((p) => p[keyValue] === val[keyValue]));
    }
    return cloneOption;
  }

const MultipleSelectorWithList =  React.forwardRef(({
    value,
    onChange,
    placeholder,
    defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      keyValue= "value",
      keyLabel= "label",
    onSearch,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    triggerSearchOnFocus,
    disabled,
    className,
    commandFilter ,
    selectFirstItem = true,
    commandProps,
    inputProps,
  }, ref) => {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState(value || []);
    const [options, setOptions] = React.useState(
      transToGroupOption(arrayDefaultOptions),
    );
    const [inputValue, setInputValue] = React.useState('');
    const debouncedSearchTerm = useDebouncedState(inputValue, delay || 500);
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
          const newOptions = selected.filter((s) => s[keyValue] !== option[keyValue]);
          setSelected(newOptions);
          onChange?.(newOptions);
        },
        [onChange, selected],
      );
  
      const handleKeyDown = React.useCallback(
        (e) => {
          const input = inputRef.current;
          if (input) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
              if (input[keyValue] === '' && selected.length > 0) {
                handleUnselect(selected[selected.length - 1]);
              }
            }
            // This is not a default behaviour of the <input /> field
            if (e.key === 'Escape') {
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
          console.log(onSearch, res, debouncedSearchTerm)
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
        if (!emptyIndicator) return undefined;
  
        // For async search that showing emptyIndicator
        if (onSearch &&  Object.keys(options).length === 0) {
          if(!debouncedSearchTerm) return  <CommandEmpty>Initiate the search with a minimum of 3 characters.</CommandEmpty>;
          return (
            <CommandItem value="-" disabled>
              {emptyIndicator}
            </CommandItem>
          );
        }
  
        return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
      }, [ emptyIndicator, onSearch, options]);
  
      const selectables = React.useMemo(
        () => removePickedOption(options, selected, keyLabel, keyValue),
        [options, selected],
      );
        console.log(selectables)
      return (
        <div>
            <div className="relative">
                <Command
                {...commandProps}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                  commandProps?.onKeyDown?.(e);
                }}
                className={cn('overflow-visible bg-transparent aalu', commandProps?.className)}
                shouldFilter={
                  commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
                } // When onSearch is provided, we don't want to filter the options. You can still override it.
                
                      >
                <div
                  className={cn(
                    'group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                    className,
                  )}
                >
                  <div className="flex flex-wrap gap-1">
                
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
                      placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : placeholder}
                      className={cn(
                        'ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground',
                        inputProps?.className,
                      )}
                    />
                  </div>
                </div>
                <div className="relative mt-2">
                  {open && (
                    <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                      {isLoading ? (
                        <>{loadingIndicator}</>
                      ) : (
                        <>
                          {EmptyItem()}
                          {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                          {Object.entries(selectables).map(([key, dropdowns]) => (
                              <ScrollArea viewPortClass="max-h-[295px] ">
                            <CommandGroup key={key} heading={key} className="">
                                {dropdowns.map((option) => {
                                  return (
                                    <CommandItem
                                      key={option[keyValue]}
                                      value={option[keyValue]}
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

                                        setInputValue('');
                                        const newOptions = [...selected, option];
                                        setSelected(newOptions);
                                        onChange?.(newOptions);
                                      }}
                                      className={cn(
                                        'cursor-pointer',
                                        option.disable && 'cursor-default text-muted-foreground',
                                      )}
                                    >
                                      {option[keyLabel]}
                                    </CommandItem>
                                  );
                                })}
                            </CommandGroup>
                              </ScrollArea>
                          ))}
                        </>
                      )}
                
                    </CommandList>
                  )}
                
                </div>
                
                      </Command>
            </div>
            {selected.map((option) => {
              return (
                <Badge
                  key={option[keyValue]}
                  className={cn(
                    'data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground',
                    'data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground',

                  )}
                  data-fixed={option.fixed}
                  data-disabled={disabled}
                >
                  {option[keyLabel]}
                  <button
                    className={cn(
                      'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      (disabled || option.fixed) && 'hidden',
                    )}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
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
        </div>
      
      )
})

export default MultipleSelectorWithList