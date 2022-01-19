const CommentRow = () => {
    return (
        <div className="flex flex-col bg-gray-50 px-3 rounded-xl font-noto py-2 shadow-lg w-11/12">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img className="rounded-full w-8 h-8" src="images/facebookcircle.png" alt="comment" />
                    <div className="flex flex-col ml-2 mb-2">
                        <span className="font-bold">username</span>
                        <span className="text-xs text-gray-400 font-semibold">1 hr ago</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <svg
                        x="0px" y="0px"
                        className="w-5 mr-2 cursor-pointer"
                        fill="gray"
                        viewBox="0 0 544.582 544.582">
                    <g>
                        <path d="M448.069,57.839c-72.675-23.562-150.781,15.759-175.721,87.898C247.41,73.522,169.303,34.277,96.628,57.839
                            C23.111,81.784-16.975,160.885,6.894,234.708c22.95,70.38,235.773,258.876,263.006,258.876
                            c27.234,0,244.801-188.267,267.751-258.876C561.595,160.732,521.509,81.631,448.069,57.839z"/>
                    </g>
                    </svg>
                    <svg className="w-5 cursor-pointer" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M16 15H0V12L7 0H9L16 12V15ZM7 4H9V9H7V4ZM7 11H9V13H7V11Z" fill="gray" fill-rule="evenodd" /></svg>
                </div>
            </div>
            <p className="text-gray-400 text-sm font-semibold">tmelkfws slekfjslek dmfslkef dmfkfms efmf ss ssk smfms.</p>
        </div>
    )
}

export default CommentRow