import { Skeleton } from "./ui/skeleton";

const TableSkeleton : React.FC = () => {
    return ( // TODO: make a loop for this, it looks like shit
        <div className="border grid w-screen h-[600px]justify-between m-auto">
          <Skeleton className="m-1 p-4 " />
          <Skeleton className=" m-1 p-3 bg-gray-200" />
          <Skeleton className="m-1 p-4 " />
          <Skeleton className=" m-1 p-4 bg-gray-200" />
          <Skeleton className="p-2 m-1 " />
          <Skeleton className="p-2 m-1 bg-gray-200" />
          <Skeleton className="m-1 p-4 " />
          <Skeleton className=" m-1 p-3 bg-gray-200" />
          <Skeleton className="m-1 p-4 " />
          <Skeleton className=" m-1 p-4 bg-gray-200" />
          <Skeleton className="p-2 m-1 " />
          <Skeleton className=" m-1 p-5 bg-gray-200" />
          <Skeleton className="m-1 p-4 " />
          <Skeleton className=" m-1 p-3 bg-gray-200" />
          <Skeleton className="m-1 p-2 " />
          <Skeleton className=" m-1 p-4 bg-gray-200" />
          <Skeleton className="p-2 m-1 " />
          <Skeleton className="p-3 m-1 bg-gray-200" />
        </div>

    );
}

export default TableSkeleton;