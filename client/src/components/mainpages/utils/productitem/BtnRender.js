import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'

export default function BtnRender({product}) {
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart

    return (
        <div className="row_btn">
            <Link id="btn_buy" to='#!' onClick={() => addCart(product)}>THÊM VÀO GIỎ HÀNG</Link>
        </div>
    )
}