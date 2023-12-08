import {v4 as uuidv4} from "uuid"
function SkeletonLoader(){
    return(
        <div>
            <div className="flex flex-col gap-7  sm:flex-row sm:justify-between mt-24">
                <div className="flex space-x-4 items-center">
                    {new Array(3).fill("*").map(() =>(
                        <div className="h-8 w-24 flex-wrap flex-shrink-0 bg-gray-500 animate-pulse" key={uuidv4()}></div>
                    ))}
                </div>
                    <div>
                        <div className="h-5 w-10 bg-gray-500 animate-pulse mb-3"></div>
                        <div className="h-5 w-32  bg-gray-500 animate-pulse mb-3"></div>
                    </div>
            </div>
            <div className="flex w-full sm:justify-between gap-5 sm:gap-0  my-12 flex-col sm:items-center sm:flex-row">
                <div>
                    <div className="animate-pulse h-8 bg-gray-500 w-12 mb-3"></div>
                    <div className="animate-pulse h-4  bg-gray-500 w-5"></div>
                </div>
                <div>
                    <div className="animate-pulse h-8 w-16 bg-gray-500"></div>
                </div>
            </div>
            <div className="rounded-md border px-6 py-8 space-y-4 border-gray-500 dark:border-gray-600">
                {new Array(5).fill('*').map(()=>(
                    <div key={uuidv4()} className="flex items-center gap-5">
                        <div className="h-12 w-12  bg-gray-500 animate-pulse"></div>
                        <div className="flex-1 h-12 bg-gray-500 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default SkeletonLoader