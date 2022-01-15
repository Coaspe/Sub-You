const AuctionTransactionRow = () => {
    return (
    <div className="flex w-full items-center justify-between mb-1">
        <div className="flex items-center justify-between">
            <img className="w-7 h-7 rounded-full mr-2" src="/images/5.jpg" alt="Auction user" />
            <span className="text-sm">username</span>
        </div>
        <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-1">0.1</span>
            <span className="text-xs text-gray-500">ETH</span>
        </div>
    </div>
    )
}

export default AuctionTransactionRow;