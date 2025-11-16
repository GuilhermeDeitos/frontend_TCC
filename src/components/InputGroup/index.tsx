export function InputGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      {children}
    </div>
  );
}