const GenericTableCell = ({ value }: { value: React.ReactNode }) => (
  <div className="flex justify-between">
    <div className="flex items-center space-x-2">
      <span>{value}</span>
    </div>
  </div>
);

export default GenericTableCell


