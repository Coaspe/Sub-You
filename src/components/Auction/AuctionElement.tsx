const AuctionElement = () => {
    return (
        <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <img className="w-7 h-7 rounded-full mr-2" src="/images/5.jpg" alt="Auction user" />
                    <span className="text-sm">username</span>
                </div>
            </div>
            <img src="/images/7.jpg" alt="Auction element" />
            <div className="flex">
                <span>Left Time</span>
                <span>Now buyer</span>
                <span>Price</span>
            </div>
        </div>
    )
}

export default AuctionElement