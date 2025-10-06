export const ClickCount = ({ data }: { data: any }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className=" bg-white p-2 rounded-lg ">
        <div className="text-sm text-gray-600 mb-1">Total Clicks</div>
        <div className="text-3xl font-semibold text-gray-900">
          {data.shortLinkData[0].clickCount}
        </div>
      </div>

      <div className=" bg-white p-2 rounded-lg ">
        <div className="text-sm text-gray-600 mb-1">Unique Clicks</div>
        <div className="text-3xl font-semibold text-gray-900">
          {data.shortLinkData[0].uniqueCount}
        </div>
      </div>
    </div>
  )
}
