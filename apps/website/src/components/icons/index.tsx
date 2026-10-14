export function CaretDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="M12 6H4l4 4.5z" />
    </svg>
  );
}

export function CaretUpDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="M11 10H5l3 3.5zm0-4H5l3-3.5z" />
    </svg>
  );
}

export function CaretUpIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="M12 10H4l4-4.5z" />
    </svg>
  );
}

export function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </svg>
  );
}

export function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m4.5 4.5 7 7m-7 0 7-7" />
    </svg>
  );
}
