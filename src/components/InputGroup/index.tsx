


export function InputGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 flex-wrap sm:flex-nowrap">
      {children}
    </div>
  );
}
