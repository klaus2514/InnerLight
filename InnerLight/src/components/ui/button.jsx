import * as React from "react";

export const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
