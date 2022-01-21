const PostSkeleton = () => {
    return (
    <div className="flex flex-col bg-gray-50 px-3 rounded-xl font-noto py-2 shadow-lg w-10/12">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="rounded-full w-8 h-8 animate-pulse bg-gray-400" />
                <div className="flex flex-col ml-2 mb-2">
                    <div className="flex items-center">
                        <p className="mr-2 animate-pulse bg-gray-400 text-gray-400 rounded-lg text-sm">username</p>
                        <svg x="0px" y="0px"
                            viewBox="0 0 60 60" 
                            className="w-4 animate-pulse"
                            fill="#9CA38F"
                            >
                        <g>
                            <path d="M30,16c4.411,0,8-3.589,8-8s-3.589-8-8-8s-8,3.589-8,8S25.589,16,30,16z"/>
                            <path d="M30,44c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S34.411,44,30,44z"/>
                            <path d="M30,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S34.411,22,30,22z"/>
                        </g>
                        </svg>
                    </div>
                    <div className="flex items-center mt-1">
                        <div className="rounded-lg text-xxs text-gray-400 font-semibold animate-pulse bg-gray-400">1 hr 전</div>
                        <div className="rounded-lg text-xxs text-gray-400 font-semibold animate-pulse bg-gray-400 ml-3">0 좋아요</div>
                        <div className="rounded-lg text-xxs text-gray-400 font-semibold animate-pulse bg-gray-400 ml-3">답글 쓰기</div>
                    </div>
                </div>
            </div>
        
            <div className="flex items-center">
                <svg x="0px" y="0px" className="w-5 mr-2 cursor-pointer animate-pulse" fill="#9CA38F" viewBox="0 0 544.582 544.582">
                    <g>
                        <path
                            d="M448.069,57.839c-72.675-23.562-150.781,15.759-175.721,87.898C247.41,73.522,169.303,34.277,96.628,57.839
                                C23.111,81.784-16.975,160.885,6.894,234.708c22.95,70.38,235.773,258.876,263.006,258.876
                                c27.234,0,244.801-188.267,267.751-258.876C561.595,160.732,521.509,81.631,448.069,57.839z" />
                    </g>
                    </svg>
            </div>
        </div>
        <p className="bg-gray-400 text-gray-400 text-sm font-semibold my-2 animate-pulse rounded-lg">lskefjalskefjslekfj</p>
    </div>
    )
}

export default PostSkeleton