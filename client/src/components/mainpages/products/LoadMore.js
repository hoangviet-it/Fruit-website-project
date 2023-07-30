import React, {useContext, useState} from 'react'
import { GlobalState } from '../../../GlobalState'

export default function LoadMore() {
    const state = useContext(GlobalState)
    const [page, setPage] = state.productsAPI.page
    const [reSult] = state.productsAPI.result

  return (
    <div className="load_more">
        {
            reSult < page * 9 ? "" : <button onClick={()=>setPage(page+1)}>Xem thêm...</button>
        }
    </div>
  )
}