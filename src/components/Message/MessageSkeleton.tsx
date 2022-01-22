const MessageSkeleton = () => {
    return (
        <div className="relative items-center w-full justify-between border px-6 py-2 rounded-2xl mb-3 shadow-lg cursor-pointer">
            <div className="flex justify-between w-full items-center">
                <div className="flex items-center">
                    <div className="rounded-full w-10 h-10 bg-gray-300 animate-pulse" />
                    <div className="flex flex-col ml-6">
                        <div className="flex items-center">
                            <div className="font-black mb-1 text-sm bg-gray-300 text-gray-300 animate-pulse rounded-lg">우람이뭐하니</div>
                            <div className={`flex rounded-full items-centers justify-center w-5 h-5 bg-gray-300 animate-pulse ml-2`}>
                            </div>
                        </div>
                        <div className="text-xs text-gray-300 bg-gray-300 animate-pulse rounded-lg">ㄴㄷㄻㄴㄷㄹㄴㄷㄹㄴㄷㄹ</div>
                    </div>
                </div>
                <div className="text-xs text-gray-300 bg-gray-300 animate-pulse rounded-lg">2021-01-1 2:20</div>
            </div>
        </div>
    )
}

export default MessageSkeleton