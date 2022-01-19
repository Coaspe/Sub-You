import CommentRow from "./CommentRow"

const Comment = () => {
    return (
        <div className="absolute w-full h-full z-20 flex flex-col items-center backdrop-filter backdrop-blur">
            <div className="flex w-full items-center justify-center my-2">
                <input
                // value={text}
                // onKeyPress={handleKeypress}
                // onChange={(e: any) => {
                //     setText(e.target.value)
                // }}
                type="text"
                placeholder="Type a message here ..."
                className="mt-2 py-2 px-3 rounded-xl text-sm w-2/3 border bg-gray-100" />
            </div>
            <div className="flex flex-col items-center gap-3 mt-3">
                <CommentRow />
                <CommentRow />
            </div>
        </div>
    )
}

export default Comment