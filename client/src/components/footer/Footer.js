import React, {useState, useContext} from 'react'
import { GlobalState } from '../../GlobalState'
import Fb from '../header/icon/facebook.svg'
import Intagram from '../header/icon/instagram.svg'
import Youtube from '../header/icon/youtube.svg'
import Phone from '../header/icon/phone.svg'
import Email from '../header/icon/email.svg'
import Address from '../header/icon/address.svg'
import Dot from '../header/icon/dot.svg'
import BackgroundFooter from '../header/icon/background.jpg'

export default function Footer() {
    const state = useContext(GlobalState)
    const [user, setUser] = useState({email: ''})
    const [isAdmin] = state.userAPI.isAdmin

    const handleOnChange = (e) =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    return (
        <div className="footer" style={isAdmin?{display:'none'}:{display:'block'}}>
            <div>
                <img className="background" src={BackgroundFooter} alt=''/>
            </div>

            <div className="wrap-footer">
                <div className="container-ft">
                    <div className="icon-mxh">
                        <h3>Kết nối với chúng tôi</h3>
                        <div className="item-mxh">
                            <img className="icon-footer" src={Fb} alt="" width="30px" />
                            <img className="icon-footer" src={Intagram} alt="" width="30px" />
                            <img className="icon-footer" src={Youtube} alt="" width="30px" />
                        </div>
                    </div>

                    <div className="info">
                        <div className="col1">
                            <h2 style={{color:"orange"}}><i>HOANGVIET FRUIT</i></h2>
                            <p><img className="icon-footer" src={Address} alt="" width="11px" />  613 Âu Cơ, P.Phú Trung, Q.Tân Phú, TP.HCM</p>
                            <p><img className="icon-footer" src={Phone} alt="" width="12px" />  0987 654 321</p>
                            <p><img className="icon-footer" src={Email} alt="" width="12px" />  hoangvietfruit@gmail.com</p>
                            <p>Đăng ký để được nhận thông tin khuyến mãi:</p>
                            <input type="email" name="email" placeholder="Email của bạn..." value={user.email} onChange={handleOnChange}/>
                            <button type="submit">Gửi</button>
                        </div>

                        <div className="col2">
                            <h2 style={{color:"orange"}}>GIỚI THIỆU</h2>
                            <ul>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Về HOANGVIET FRUIT</li>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Tuyển dụng</li>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Chính sách bảo mật</li>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Hợp tác và liên kết</li>
                            </ul>
                        </div>

                        <div className="col3">
                            <h2 style={{color:"orange"}}>HỖ TRỢ KHÁCH HÀNG</h2>
                            <ul>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Khách hàng thân thiết</li>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Ưu đãi theo dịp lễ</li>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Chính sách vận chuyển</li>
                                <li><img className="icon-footer" src={Dot} alt="" width="7px" />  Ý kiến khách hàng</li>
                            </ul>
                        </div>
                        
                    </div>

                    <div className="copyright">
                        <p>© 2022 Copyright : HOANGVIETFRUIT.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}