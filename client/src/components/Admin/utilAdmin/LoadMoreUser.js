import React, {useContext, useState} from 'react'
import { GlobalState } from '../../../GlobalState'

export default function LoadMoreUser() {
    const state = useContext(GlobalState)
    const [page, setPage] = state.userAPI.page
    const [reSult] = state.userAPI.result

return (
    <div className="load_more loadmore-ord-ad">
        {
            reSult < page * 10 ? "" : <button onClick={()=>setPage(page+1)}>Xem thêm...</button>
        }
    </div>
  )
}
