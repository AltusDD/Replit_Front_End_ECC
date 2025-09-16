import { useState, useRef, useEffect } from "react";

interface TypeaheadOption {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface TypeaheadProps {
  value: string;
  onChange: (value: string, option?: TypeaheadOption) => void;
  onSearch: (query: string) => Promise<TypeaheadOption[]>;
  onCreate?: (query: string) => Promise<TypeaheadOption>;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  testId?: string;
}

export default function Typeahead({
  value,
  onChange,
  onSearch,
  onCreate,
  placeholder,
  label,
  disabled,
  testId
}: TypeaheadProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<TypeaheadOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const results = await onSearch(searchQuery);
      setOptions(results);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search failed:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (createQuery: string) => {
    if (!onCreate) return;
    
    setLoading(true);
    try {
      const newOption = await onCreate(createQuery);
      onChange(newOption.id, newOption);
      setQuery(newOption.name);
      setIsOpen(false);
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option: TypeaheadOption) => {
    onChange(option.id, option);
    setQuery(option.name);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const maxIndex = options.length + (onCreate ? 1 : 0) - 1;
        setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex === -1) return;
        if (selectedIndex === options.length && onCreate) {
          handleCreate(query);
        } else if (options[selectedIndex]) {
          handleSelect(options[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative" data-testid={testId}>
      {label && (
        <label style={{
          display: "block",
          color: "var(--text-primary, #f7f8fb)",
          fontSize: "var(--font-size-sm, 14px)",
          fontWeight: "var(--font-weight-medium, 500)",
          marginBottom: "var(--space-xs, 4px)"
        }}>
          {label}
        </label>
      )}
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery);
          handleSearch(newQuery);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "var(--space-sm, 8px) var(--space-md, 12px)",
          backgroundColor: "var(--bg-tertiary, #151821)",
          border: "1px solid var(--border-primary, #1b1f28)",
          borderRadius: "var(--radius-md, 8px)",
          color: "var(--text-primary, #f7f8fb)",
          fontSize: "var(--font-size-md, 14px)",
          outline: "none",
          transition: "border-color 0.2s ease"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--brand-gold, #f2c86a)";
          if (query.trim()) {
            handleSearch(query);
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-primary, #1b1f28)";
          setTimeout(() => setIsOpen(false), 150);
        }}
        data-testid={testId ? `${testId}-input` : undefined}
      />

      {isOpen && (
        <ul
          ref={listRef}
          style={{
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "var(--bg-secondary, #111318)",
            border: "1px solid var(--border-primary, #1b1f28)",
            borderRadius: "var(--radius-md, 8px)",
            marginTop: "var(--space-xs, 4px)",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
          }}
          data-testid={testId ? `${testId}-options` : undefined}
        >
          {loading ? (
            <li style={{
              padding: "var(--space-sm, 8px) var(--space-md, 12px)",
              color: "var(--text-muted, #8891a3)",
              fontSize: "var(--font-size-sm, 13px)"
            }}>
              Searching...
            </li>
          ) : (
            <>
              {options.map((option, index) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: "var(--space-sm, 8px) var(--space-md, 12px)",
                    cursor: "pointer",
                    backgroundColor: selectedIndex === index ? "var(--bg-tertiary, #151821)" : "transparent",
                    borderBottom: index < options.length - 1 ? "1px solid var(--border-primary, #1b1f28)" : "none"
                  }}
                  data-testid={testId ? `${testId}-option-${option.id}` : undefined}
                >
                  <div style={{
                    color: "var(--text-primary, #f7f8fb)",
                    fontSize: "var(--font-size-sm, 13px)",
                    fontWeight: "var(--font-weight-medium, 500)"
                  }}>
                    {option.name}
                  </div>
                  {(option.email || option.phone) && (
                    <div style={{
                      color: "var(--text-muted, #8891a3)",
                      fontSize: "var(--font-size-xs, 12px)",
                      marginTop: "var(--space-xs, 4px)"
                    }}>
                      {option.email} {option.phone && `• ${option.phone}`}
                    </div>
                  )}
                </li>
              ))}
              
              {options.length === 0 && !loading && onCreate && query.trim() && (
                <li
                  onClick={() => handleCreate(query)}
                  style={{
                    padding: "var(--space-sm, 8px) var(--space-md, 12px)",
                    cursor: "pointer",
                    backgroundColor: selectedIndex === options.length ? "var(--bg-tertiary, #151821)" : "transparent",
                    borderTop: options.length > 0 ? "1px solid var(--border-primary, #1b1f28)" : "none"
                  }}
                  data-testid={testId ? `${testId}-create-option` : undefined}
                >
                  <div style={{
                    color: "var(--brand-gold, #f2c86a)",
                    fontSize: "var(--font-size-sm, 13px)",
                    fontWeight: "var(--font-weight-medium, 500)"
                  }}>
                    Create Owner: {query}
                  </div>
                  <div style={{
                    color: "var(--text-muted, #8891a3)",
                    fontSize: "var(--font-size-xs, 12px)",
                    marginTop: "var(--space-xs, 4px)"
                  }}>
                    Add as new owner
                  </div>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}