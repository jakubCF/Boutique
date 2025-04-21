import { Skeleton } from "../@shadcn/ui/skeleton";

/**
 * TableSkeleton component for displaying a skeleton loading state for a table.
 *
 * This component renders a series of skeleton elements to mimic the appearance
 * of a table while data is being loaded.
 *
 * @returns A JSX element representing the table skeleton.
 */
const TableSkeleton: React.FC = () => {
    const skeletonCount = 17; // Number of skeleton rows to display

    return (
        <div className="w-full max-w-[1400px] max-h-[850px] p-4 rounded-lg shadow-lg">
            {/* Loop to generate skeleton rows */}
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <Skeleton
                    key={index}
                    className={`m-1 p-4 ${index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}`}
                />
            ))}
        </div>
    );
};

export default TableSkeleton;